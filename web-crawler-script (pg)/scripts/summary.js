const retry = require('../util/retry')
const { query } = require('../util/db')

const deleteSummary = async () => {
    await query(`delete from stk_price where date=$1`, [new Date()])
}

const getSummary = async (page, ticker) => {
    return retry(async () => {
        await page.goto(`https://finance.yahoo.com/quote/${ticker}`);
        await page.waitForSelector('#quote-summary', { visible: true });

        const summary = await evaluate(page) // {exchangeCurrency, price, priceChange, priceTarget, marketCap, PE(TTM), EPS(TTM), volume, averageVolume}
        return summary
    }, 3)
}

const evaluate = async (page) => {

    const summary = await page.evaluate(() => {
        const formatNum = (numStr) => {
            numStr = numStr.replace(/,/g, '')
            const unit = numStr[numStr.length - 1]
            if (unit === 'T') return parseFloat(numStr) * 1000000000000
            if (unit === 'B') return parseFloat(numStr) * 1000000000
            if (unit === 'M') return parseFloat(numStr) * 1000000
            // if NA, store as null
            return parseFloat(numStr)
        }

        let temp

        temp = document.querySelectorAll('#quote-header-info > div')[2].querySelectorAll('div')[0].querySelectorAll('div > span')
        const price = formatNum(temp[0].textContent)
        const priceChange = temp[1].textContent

        const summaryTables = document.querySelectorAll('#quote-summary > div')
        temp = summaryTables[0].querySelectorAll('tr')
        const volume = formatNum(temp[6].querySelectorAll('td')[1].querySelector('span').textContent)
        const averageVolume = formatNum(temp[7].querySelectorAll('td')[1].querySelector('span').textContent)

        temp = summaryTables[1].querySelectorAll('tr')
        const marketCap = formatNum(temp[0].querySelectorAll('td')[1].querySelector('span').textContent)
        const priceTarget = formatNum(temp[7].querySelectorAll('td')[1].querySelector('span').textContent)
        const summary = {
            price, priceChange, priceTarget, volume, averageVolume, marketCap
        }
        return JSON.stringify(summary)
    })

    return JSON.parse(summary)
}

const insertSummaryintoDB = async (client, data) => {
    const { ticker, summary } = data
    const { price, priceChange, priceTarget, volume, averageVolume, marketCap } = summary
    let text = `
    select * from stk 
    join currency
    on currency.curr_code = stk.curr_code_ex and currency.year = $1
    where stk.code = $2`
    let values = [new Date().getFullYear(), ticker]
    let result = await client.query(text, values)
    const ex_rate = result.rows[0].ex_rate
    const date = new Date().toLocaleDateString('en-ZA')

    // For PE, PS, PB
    text = `
    select * from stk_fs
    where code = $1 and year = (
    select max(year)
    from stk_fs
    where code = $2
    )`
    values = [ticker, ticker]
    result = await client.query(text, values)
    const rev = result.rows.find(el => el.acc_code === 'rev').amt
    const net_pl = result.rows.find(el => el.acc_code === 'net_pl').amt
    const eq = result.rows.find(el => el.acc_code === 'eq').amt

    const PE = net_pl === '0' ? null : marketCap / net_pl
    const PS = rev === '0' ? null : marketCap / rev
    const PB = marketCap / eq

    // For PEG
    text = `
    select * from stk_ratio
    where code = $1 and year = (
    select max(year)
    from stk_fs
    where code = $2
    )`
    values = [ticker, ticker]
    result = await client.query(text, values)
    const inc3yrCagr = result.rows.find(el => el.ratio_code === 'inc3yrCagr').base_amt
    const PEG = (inc3yrCagr && PE && (!inc3yrCagr <= 0) && (!PE <= 0)) ? PE / inc3yrCagr : null
    text = `
        insert into stk_price (code, date, price, price_base, price_change, price_target, pe, ps, pb, peg, vol, ave_vol, cap, cap_base)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `
    values = [ticker, date, price, price / ex_rate, priceChange, priceTarget, PE, PS, PB, PEG, volume, averageVolume, marketCap, marketCap / ex_rate]
    await client.query(text, values)
}

module.exports = { getSummary, deleteSummary, insertSummaryintoDB }