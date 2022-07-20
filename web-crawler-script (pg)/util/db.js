const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionTimeoutMillis: 2000
})

module.exports = {
    pool,
    query: async (text, params) => {
        return await pool.query(text, params)
    },
    getClient: async () => {
        return await pool.connect()
    }
}