const retry = require('../util/retry')
const { query, getClient } = require('../util/db')
const { insertProfileintoDB } = require('./profile')
const { insertBSintoDB } = require('./FS/bs')
const { insertPNLintoDB } = require('./FS/pl')
const { insertRatiosIntoDB } = require('./FS/ratios')
const { insertSummaryintoDB } = require('./summary')

const getTickers = async () => {
    const result = await query(`select code from stk`, [])
    return result.rows.map(el => el.code)
}

const getTickersFSToUpdate = async () => {
    const result = await query(`select code, max(year) as year from stk_fs group by code`, [])
    const tickers = result.rows.filter(el => {
        const [currYr, currMth, currDay] = new Date().toLocaleDateString('en-ZA').split('/')
        const [latestYr, latestMth, latestDay] = el.year.split('/')
        let noOfMths = 0 
        noOfMths = noOfMths + (parseInt(currYr) - parseInt(latestYr)) * 12
        noOfMths = noOfMths + parseInt(currMth) - parseInt(latestMth)
        return noOfMths >= 15
    }).map(el => el.code)
    return tickers
}

const insertIntoDB = (data) => {
    const execute = async () => {
        const client = await getClient()
        try {
            await client.query('BEGIN')

            if (process.argv[2] === 'load') {
                await insertProfileintoDB(client, data)
            }

            if (process.argv[2] === 'fs') {

                // If is update, filter for FS to update ONLY to prevent inserting FS that alr exist
                if (process.argv[3] === 'update') {
                    // Function verifies if FS can be inserted into DB
                    data.FSToUpdate = await createFSToUpdate(data.ticker)
                }

                await insertBSintoDB(client, data)
                await insertPNLintoDB(client, data)
                await insertRatiosIntoDB(client, data)
            }

            if (process.argv[2] === 'daily') {
                await insertSummaryintoDB(client, data)
            }
            
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }
    return retry(execute, 3)
}

const createFSToUpdate = async (ticker) => {
    const result = await query(`select max(year) as year from stk_fs where code = $1 group by code`, [ticker])
    const [latestYr, latestMth, latestDay] = result.rows[0].year.split('/')
    return (s) => {
        const [fsYr, fsMth, fsDay] = s.year.split('/')
        let noOfMths = 0 
        noOfMths = noOfMths + (parseInt(fsYr) - parseInt(latestYr)) * 12
        noOfMths = noOfMths + parseInt(fsMth) - parseInt(latestMth)
        return noOfMths > 0
    }
}

module.exports = { getTickers, getTickersFSToUpdate, insertIntoDB }