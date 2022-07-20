const retry = require('../../util/retry')

// Important: async functions automatically return a promise! 
// Therefore, try not to use try and catch within async. Try to allow errors to propagate and handle it at outermost layer.

const getPNL = async (page, ticker) => {
    return retry(async () => {
        await page.goto(`https://finance.yahoo.com/quote/${ticker}/financials?p=${ticker}`);
        await page.waitForSelector('#Col1-1-Financials-Proxy', { visible: true });

        let incomeStatements = await evaluate(page) // [{}, ...]
        return incomeStatements
    }, 3)
}

// Web scraping - output = [{ yearXpnl }, ...]
// Handle empty column value same as bs. 
const evaluate = async (page) => {

    const annualReports = await page.evaluate(() => {
        let reports = []

        //header
        const hdrList = document.querySelector('#Col1-1-Financials-Proxy').querySelector('[class="D(tbhg)"]').querySelectorAll('span')

        // currency
        const exchangeCurrency = document.getElementById('quote-header-info').querySelector('span').textContent.slice(-3)
        const currencyText = Array.from(document.querySelectorAll('#Col1-1-Financials-Proxy > section > div')[1].children).filter(el => el.matches('span'))[0].children[0]
        let specificCurrency = exchangeCurrency
        if (currencyText.childNodes.length > 1) specificCurrency = currencyText.childNodes[1].textContent.slice(-5, -2)

        // table content
        const table = document.querySelector('#Col1-1-Financials-Proxy').querySelectorAll('[class="D(tbrg)"] > div')

        // List of row titles for indexing by name below
        let rowNodes = {}

        table.forEach(el => rowNodes[el.querySelector('span').textContent] = el)

        // Handles cases when value for a column is -
        const returnList = (rowName1, rowName2) => {
            let node = rowNodes[rowName1] || rowNodes[rowName2]
            let list = []
            
            if (!node) {
                hdrList.forEach(el => list.push(document.createElement('span')))
                list.forEach(s => s.appendChild(document.createTextNode('NA')))
                return list
            }
            // Also, we do not look for buttons or expandable.
            node.children[0].children.forEach(divNode => {
                if (divNode.querySelector('span')) {
                    list.push(divNode.querySelector('span'))
                } else { // value is - and no span element
                    list.push(document.createElement('span').appendChild(document.createTextNode('NA')))
                }
            })

            // If row exists and ALL values null, Yahoo finance might be faking results. Throw error and try again. 
            if (Array.from(list).every(s => !s.textContent)) throw new Error('Yahoo might be faking')
            return list
        }

        // total revenue
        const revList = returnList('Total Revenue', 'Total revenue')

        // gross profit
        const GPList = returnList('Gross Profit', 'Gross profit')

        // operating profit
        const OIList = returnList('Operating Income', 'Operating income or loss')

        // income to shareholders 
        const incomeList = returnList('Net Income Common Stockholders', 'Net income available to common shareholders')

        // if day is 31, change it to 30. This causes error of totalAssets of undefined in ratios. 
        // Yahoo Finance often fakes this detail. 
        const formatDateEnding = (hdrList, i) => {
            let parts = hdrList[i].textContent.split('/')
            if (parts[1] === '31' || parts[1] === '29') parts[1] = '30'

            if (parts[0].length === 1) parts[0] = '0' + parts[0]
            if (parts[1].length === 1) parts[1] = '0' + parts[1]

            return parts = parts[2] + '/' + parts[0] + '/' + parts[1]
        }

        for (let i = 2; i < hdrList.length; i++) {
            reports.push({
                year: formatDateEnding(hdrList, i),
                reportedCurrency: specificCurrency ? specificCurrency : exchangeCurrency,
                revenue: parseInt(revList[i].textContent.replace(/,/g, '') + '000'),
                grossProfit: parseInt(GPList[i].textContent.replace(/,/g, '') + '000'),
                operatingIncome: parseInt(OIList[i].textContent.replace(/,/g, '') + '000'),
                incomeAttrShareholders: parseInt(incomeList[i].textContent.replace(/,/g, '') + '000')
            })
        }

        return JSON.stringify(reports)
    })
    return JSON.parse(annualReports)
}

const insertPNLintoDB = async (client, data) => {
    const { ticker, pl } = data
    console.log(pl)
    for (let s of pl) {

        // if 'update', ignore fs that already exist in DB: NOT TESTED
        if (!data.FSToUpdate(s)) { continue }

        let text = `select * from currency where curr_code=$1 and year=$2`
        let values = [s.reportedCurrency, s.year.slice(0, 4)]
        const result = await client.query(text, values)
        const ex_rate = result.rows[0].ex_rate
        const { year, reportedCurrency, revenue, grossProfit, operatingIncome, incomeAttrShareholders } = s

        text = `
            insert into stk_fs (
                code, year, qtr, type, acc_code, curr_code_rep, amt, base_amt
            ) values (
                $1, $2, $3, $4, $5, $6, $7, $8
            )
        `
        values = [ticker, year, 'FY', 'PL', 'rev', reportedCurrency, revenue, revenue / ex_rate]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'PL', 'gp', reportedCurrency, grossProfit, grossProfit === null ? null: ( grossProfit / ex_rate )]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'PL', 'op_inc', reportedCurrency, operatingIncome, operatingIncome === null ? null: ( operatingIncome / ex_rate )]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'PL', 'net_pl', reportedCurrency, incomeAttrShareholders, incomeAttrShareholders / ex_rate]
        await client.query(text, values)
    }
}


module.exports = { getPNL, insertPNLintoDB }
