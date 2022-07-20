const retry = require('../../util/retry')

const getBS = async (page, ticker) => {
    return retry(async () => {
        await page.goto(`https://finance.yahoo.com/quote/${ticker}/balance-sheet?p=${ticker}`);
        await page.waitForSelector('#Col1-1-Financials-Proxy', { visible: true });

        let bs = await evaluate(page, ticker) // [{}, ...]
        return bs
    }, 3)
}

const evaluate = async (page, ticker) => {
    const balanceSheets = await page.evaluate((ticker) => {
        let reports = []

        //header
        const hdrList = document.querySelector('#Col1-1-Financials-Proxy').querySelector('[class="D(tbhg)"]').querySelectorAll('span')

        // currency
        const exchangeCurrency = document.getElementById('quote-header-info').querySelector('span').textContent.slice(-3)
        const currencyText = document.querySelectorAll('#Col1-1-Financials-Proxy > section > div')[1].querySelectorAll('span')[3]
        let specificCurrency
        if (ticker.slice(-2) === 'HK') {
            specificCurrency = 'CNY'
        }
        if (currencyText.childNodes.length > 1) specificCurrency = currencyText.childNodes[1].textContent.slice(-5, -2)

        // table content
        const table = document.querySelector('#Col1-1-Financials-Proxy').querySelectorAll('[class="D(tbrg)"] > div')

        // List of row titles and DOM nodes for indexing by name below
        let rowNodes = {}

        // Recursion to expand everything. 
        const expandAll = (el) => {
            if (el.querySelector('button')) {
                el.querySelector('button').click()
                rowNodes[el.children[0].querySelector('span').textContent] = el.children[0]
                el.children[1].children.forEach(c => expandAll(c))
                return
            } else {
                rowNodes[el.querySelector('span').textContent] = el
                return
            }
        }

        for (let row of table) {
            expandAll(row)
        }

        // Handles cases when value for a column is -
        const returnList = (rowName) => {
            let node = rowNodes[rowName]
            let list = []
            if (!node) {
                hdrList.forEach(el => list.push(document.createElement('span')))
                list.forEach(s => s.appendChild(document.createTextNode('NA')))
                return list
            }

            //if row has button it has different structure
            if (node.querySelector('button')) {
                node.children.forEach(divNode => {
                    if (divNode.querySelector('span')) {
                        list.push(divNode.querySelector('span'))
                    } else { // value is - and no span element
                        list.push(document.createElement('span').appendChild(document.createTextNode('NA')))
                    }
                })
            } else {
                node.children[0].children.forEach(divNode => {
                    if (divNode.querySelector('span')) {
                        list.push(divNode.querySelector('span'))
                    } else { // value is - and no span element
                        list.push(document.createElement('span').appendChild(document.createTextNode('NA')))
                    }
                })
            }

            // If row exists and ALL values null, Yahoo finance might be faking results. Throw error and try again. 
            if (Array.from(list).every(s => !s.textContent)) throw new Error('Yahoo might be faking')
            return list
        }

        // total assets
        const assetList = returnList('Total Assets')

        // current assets
        const caList = returnList('Current Assets')

        // inventory
        const invList = returnList('Inventory')

        // total liabilities
        const liabList = returnList('Total Liabilities Net Minority Interest')

        // current liabilities or trading liabities HK0005
        const clList = returnList('Current Liabilities')

        // total equity
        const eqList = returnList('Total Equity Gross Minority Interest')

        // no shares 
        const sharesList = returnList('Ordinary Shares Number')

        // if day is 31, change it to 30. This causes error of totalAssets of undefined in ratios. 
        // Yahoo Finance often fakes this detail. 
        const formatDateEnding = (hdrList, i) => {
            let parts = hdrList[i].textContent.split('/')
            if (parts[1] === '31' || parts[1] === '29') parts[1] = '30'
            
            if (parts[0].length === 1) parts[0] = '0' + parts[0]
            if (parts[1].length === 1) parts[1] = '0' + parts[1]
            
            return parts = parts[2] + '/' + parts[0] + '/' + parts[1]
        }


        for (let i = 1; i < hdrList.length; i++) { // No TTM
            reports.push({
                year: formatDateEnding(hdrList, i),
                reportedCurrency: specificCurrency ? specificCurrency : exchangeCurrency,
                totalAssets: parseInt(assetList[i].textContent.replace(/,/g, '') + '000'),
                currentAssets: parseInt(caList[i].textContent.replace(/,/g, '') + '000'),
                inventory: parseInt(invList[i].textContent.replace(/,/g, '') + '000'),
                totalLiabilities: parseInt(liabList[i].textContent.replace(/,/g, '') + '000'),
                currentLiabilities: parseInt(clList[i].textContent.replace(/,/g, '') + '000'),
                totalEquity: parseInt(eqList[i].textContent.replace(/,/g, '') + '000'),
                noShares: parseInt(sharesList[i].textContent.replace(/,/g, '') + '000'),
            })
        }

        return JSON.stringify(reports)


    }, ticker)
    return JSON.parse(balanceSheets)
}

const insertBSintoDB = async (client, data) => {
    const { ticker, bs } = data
    console.log(bs)
    for (let s of bs) {

        // if 'update', ignore fs that already exist in DB: NOT TESTED
        if (!data.FSToUpdate(s)) { continue }

        let text = `select * from currency where curr_code=$1 and year=$2`
        console.log(s.year.slice(0, 4))
        let values = [s.reportedCurrency, s.year.slice(0, 4)]
        const result = await client.query(text, values)
        const ex_rate = result.rows[0].ex_rate
        const { year, reportedCurrency, totalAssets, currentAssets, inventory, totalLiabilities, currentLiabilities, totalEquity, noShares } = s
        text = `
            insert into stk_fs (
                code, year, qtr, type, acc_code, curr_code_rep, amt, base_amt
            ) values (
                $1, $2, $3, $4, $5, $6, $7, $8
            )
        `

        const convertToBase = (value) => {
            if (value === null) return null
            else return value / ex_rate
        }

        values = [ticker, year, 'FY', 'BS', 'asset', reportedCurrency, totalAssets, convertToBase(totalAssets)]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'BS', 'ca', reportedCurrency, currentAssets, convertToBase(currentAssets)]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'BS', 'inv', reportedCurrency, inventory, convertToBase(inventory)]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'BS', 'liab', reportedCurrency, totalLiabilities, convertToBase(totalLiabilities)]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'BS', 'cl', reportedCurrency, currentLiabilities, convertToBase(currentLiabilities)]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'BS', 'eq', reportedCurrency, totalEquity, convertToBase(totalEquity)]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'BS', 'no_shares', reportedCurrency, noShares, noShares]
        await client.query(text, values)

    }

}


module.exports = { getBS, insertBSintoDB }