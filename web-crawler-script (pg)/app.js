// Arguments: daily - get summary (price) or load (get profile)
// qtr getting pnl/bs items. 

const puppeteer = require('puppeteer')
const fs = require('fs')

const { pool } = require('./util/db')
const { getProfile } = require('./scripts/profile')
const { getBS } = require('./scripts/FS/bs')
const { getPNL } = require('./scripts/FS/pl')
const { deleteSummary, getSummary } = require('./scripts/summary')
const { getTickers, getTickersFSToUpdate, insertIntoDB } = require('./scripts/DBQueries')

const filePath = './input.json'
let inputTickers = JSON.parse(fs.readFileSync(filePath))

// Use MacroTrends for US stocks and Yahoo Finance for Hong Kong stocks. 
let failedAt
let browser

const startCrawler = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--disable-extensions']
    })

    const page = await browser.newPage();
    if (process.argv[2] === 'load') {
        for (let i = 0; i < inputTickers.length; i++) {
            failedAt = inputTickers[i]
            console.log('at ' + inputTickers[i])
            // Execute scripts
            let profile
            try {
                profile = await getProfile(page, inputTickers[i])
            } catch (err) {
                console.log(`data for ${inputTickers[i]} could not be found`)
                continue;
            }
            const data = { ticker: inputTickers[i], profile }
            await insertIntoDB(data)
        }
    }

    if (process.argv[2] === 'fs') { // Change to initFS. Another function dailyFS
        if (!process.argv[3]) throw new Error(`Additional arg 'init' or 'update' required`)
        if (process.argv[3] === 'update') inputTickers = await getTickersFSToUpdate()
        for (let i = 0; i < inputTickers.length; i++) {
            failedAt = inputTickers[i]
            console.log('at ' + inputTickers[i])
            let bs, pl
            try {
                // Execute scripts
                bs = await getBS(page, inputTickers[i])
                pl = await getPNL(page, inputTickers[i])
            } catch (err) {
                console.log(`data for ${inputTickers[i]} could not be found`)
                continue;
            }

            const data = { ticker: inputTickers[i], pl, bs }
            try {
                await insertIntoDB(data)
            } catch (err) { console.log(err) }

        }
    }

    if (process.argv[2] === 'daily') {
        // const DBTickers = await getTickers()
        // await deleteSummary()
        const DBTickers = inputTickers

        for (let i = 0; i < DBTickers.length; i++) {
            console.log(`at ${DBTickers[i]}`)
            failedAt = DBTickers[i]
            let summary
            try {
                // Execute scripts
                summary = await getSummary(page, DBTickers[i])
                const data = { ticker: DBTickers[i], summary }
                await insertIntoDB(data)
            } catch (err) {
                console.log(err)
                //console.log(`data for ${DBTickers[i]} could not be found`)
                continue;
            }
        }
    }

}

const endProcess = async () => {
    let pages = await browser.pages();
    await Promise.all(pages.map(page => page.close()));
    await browser.close();
    await pool.end()
}

const startDBConnection = async function () {
    const client = await pool.connect()
    client.query('SELECT NOW()')
    return client.release()
}

startDBConnection()
    .then(() => startCrawler())
    .then(() => endProcess())
    .catch((err) => {
        fs.appendFile('./errors.log', `Time: ${new Date()}, Failed At: ${failedAt}, Error: ${err.message}\n`, () => { })
        console.log(err)
        endProcess()
    })

