const retry = require('../util/retry')

const getProfile = async (page, ticker) => {
    return retry(async () => {
        await page.goto(`https://finance.yahoo.com/quote/${ticker}/profile?p=${ticker}`);
        await page.waitForSelector('#Col1-0-Profile-Proxy', { visible: true });

        const profile = await evaluate(page)
        return profile
    }, 3)
}

const evaluate = async (page) => {

    const profile = await page.evaluate(() => {
        let profileContainer = document.querySelector('#Col1-0-Profile-Proxy .asset-profile-container > div')
        const name = profileContainer.querySelector('h3').textContent
        let temp = profileContainer.querySelector('div > div').querySelectorAll('p')[1].querySelectorAll('span')
        const sector = temp[1].textContent
        const industry = temp[3].textContent
        const fullTimeEmployees = parseInt(temp[5].textContent.replace(/,/g, ''))

        temp = document.getElementById('quote-header-info').querySelector('span').textContent
        const exchange = temp.split(' ')[0]
        const exchangeCurrency = temp.slice(-3)

        const description = document.querySelector('#Col1-0-Profile-Proxy > section').querySelectorAll('section')[1].querySelector('p').textContent
        const profile = {
            name, sector, industry, exchange, exchangeCurrency, fullTimeEmployees, description
        }
        return JSON.stringify(profile)
    })

    return JSON.parse(profile)
}

const insertProfileintoDB = async (client, data) => {
    const { ticker, profile } = data
    const { name, sector, industry, exchange, exchangeCurrency, description, fullTimeEmployees } = profile
    const text = `
        insert into stk (code, name, sector, industry, exchange, curr_code_ex, des, no_employee)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
    `
    const values = [ticker, name, sector, industry, exchange, exchangeCurrency, description, fullTimeEmployees]
    await client.query(text, values)
}

module.exports = { getProfile, insertProfileintoDB }