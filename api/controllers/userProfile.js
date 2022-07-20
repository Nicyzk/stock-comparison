const db = require('../util/db')

exports.createNewPortfolio = async (req, res, next) => {
    const { name } = req.body
    const user_id = req.user.user_id
    try {
        let text = 'SELECT * FROM user_portfolios WHERE user_id = $1 AND port_id = $2'
        let result = await db.query(text, [user_id, name])
        if (result.rows.length >= 1) {
            const error = new Error('Portfolio name already exists.')
            error.statusCode = 422
            throw error
        }
        text = 'INSERT INTO user_portfolios (user_id, port_id) VALUES ($1, $2)'
        await db.query(text, [user_id, name])
        res.status(200).json({
            message: `portfolio: ${name} created`
        })
    } catch (err) {
        next(err)
    }
}

exports.getUserPortfolios = async (req, res, next) => {
    const user_id = req.user.user_id
    try {
        let text = `
        SELECT a.user_id, a.port_id, b.code FROM user_portfolios a
        LEFT JOIN user_portfolio_stk b 
        ON a.user_id = b.user_id AND a.port_id = b.port_id
        WHERE a.user_id = $1`
        let result = await db.query(text, [user_id])
        const list = result.rows
        let portfolios = []
        for (let t of list) {
            let index = portfolios.findIndex(p => p.name === t.port_id)
            if (index >= 0) portfolios[index].tickers.push(t.code)
            else {
                let p = { name: t.port_id, tickers: [] }
                if (t.code) p.tickers.push(t.code) // t.code === null means portfolio has no tickers at all.
                portfolios.push(p)
            }
        }
        res.status(200).json({
            portfolios
        })
    } catch (err) {
        next(err)
    }
}

exports.addToPortfolio = async (req, res, next) => {
    const { name, tickers } = req.body
    const user_id = req.user.user_id
    const client = await db.getClient()
    try {
        await client.query('BEGIN')
        let text = 'SELECT * FROM user_portfolios WHERE user_id = $1 AND port_id = $2'
        let result = await client.query(text, [user_id, name])
        if (result.rows.length <= 0) {
            const error = new Error('User does not have the portfolio specified saved. Are you trying to edit a default portfolio?')
            error.statusCode = 422
            throw error
        }

        for (let t of tickers) {
            text = 'SELECT * FROM user_portfolio_stk WHERE user_id = $1 AND port_id = $2 AND code = $3'
            result = await client.query(text, [user_id, name, t])
            if (result.rows.length > 0) {
                const error = new Error('Ticker(s) already exist in portfolio.')
                error.statusCode = 422
                throw error
            }
            text = 'INSERT INTO user_portfolio_stk (user_id, port_id, code) VALUES ($1, $2, $3)'
            await client.query(text, [user_id, name, t])
        }

        await client.query('COMMIT')
        res.status(200).json({
            message: `tickers added to portfolio: ${name}`
        })
    } catch (err) {
        await client.query('ROLLBACK')
        next(err)
    }
    finally {
        client.release()
    }
}

exports.removeFromPortfolio = async (req, res, next) => {
    const { name, tickers } = req.body
    const user_id = req.user.user_id
    const client = await db.getClient()
    try {
        await client.query('BEGIN')
        let text = 'SELECT * FROM user_portfolios WHERE user_id = $1 AND port_id = $2'
        let result = await client.query(text, [user_id, name])
        if (result.rows.length <= 0) {
            const error = new Error('User does not have the portfolio specified saved. Are you trying to edit a default portfolio?')
            error.statusCode = 422
            throw error
        }

        for (let t of tickers) {
            text = 'DELETE FROM user_portfolio_stk WHERE user_id = $1 AND port_id = $2 AND code = $3'
            result = await client.query(text, [user_id, name, t])
        }

        await client.query('COMMIT')
        res.status(200).json({
            message: `tickers removed from portfolio: ${name}`
        })
    } catch (err) {
        await client.query('ROLLBACK')
        next(err)
    }
    finally {
        client.release()
    }
}

exports.deletePortfolio = async (req, res, next) => {
    const { name } = req.body
    const user_id = req.user.user_id
    const client = await db.getClient()
    try {
        await client.query('BEGIN')
        let text = 'SELECT * FROM user_portfolios WHERE user_id = $1 AND port_id = $2'
        let result = await client.query(text, [user_id, name])
        if (result.rows.length <= 0) {
            const error = new Error('User does not have the portfolio specified saved. Are you trying to delete a default portfolio?')
            error.statusCode = 422
            throw error
        }
        text = 'DELETE FROM user_portfolio_stk WHERE user_id = $1 AND port_id = $2'
        await client.query(text, [user_id, name])
        text = 'DELETE FROM user_portfolios WHERE user_id = $1 AND port_id = $2'
        await client.query(text, [user_id, name])
        await client.query('COMMIT')
        res.status(200).json({
            message: `Portfolio: ${name} deleted`
        })
    } catch (err) {
        await client.query('ROLLBACK')
        next(err)
    } 
    finally {
        client.release()
    }
}