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

// Notes: pool.query() checks out a client from pool, performs a single query and releases client into pool automatically.
// It should not be used for a transaction. Splitting queries in a transaction across different clients will cause errors. 
// Use pool.connect() to perform multiple queries on the same checked out client. 