const db = require('../util/db')

exports.getName = async (req, res, next) => {
    try {
        const result = await db.query('SELECT code, name from stk')
        const profile = result.rows
        const output = {
            names: []
        }
        profile.forEach(p => output.names.push({ ticker: p.code, name: p.name }))
        res.status(200).json(output)
    } catch (err) {
        next(err)
    }
}

exports.getProfile = async (req, res, next) => {
    const { tickers } = req.body
    if (tickers.length <= 0) return res.status(200).json({ profile: {} }) 
    var params = [];
    for (var i = 1; i <= tickers.length; i++) {
        params.push('$' + i);
    }
    try {
        let text = `
        SELECT * from stk 
        JOIN stk_price
        ON stk.code = stk_price.code
        join currency
        on stk.curr_code_ex = currency.curr_code and LEFT(stk_price.date, 4) = currency.year
        WHERE date=(SELECT max(date) from stk_price) AND stk.code IN (${params.join(',')})`
        const result = await db.query(text, [...tickers])
        const profile = result.rows
        const output = {
            profile: {}
        }
        profile.forEach(p => output.profile[p.code] = p)
        res.status(200).json(output)
    } catch (err) {
        next(err)
    }
}

exports.getPL = async (req, res, next) => {
    const { tickers } = req.body
    if (tickers.length <= 0) return res.status(200).json({ annualPnL: {} }) 
    var params = [];
    for (var i = 1; i <= tickers.length; i++) {
        params.push('$' + i);
    }
    try {
        const result = await db.query('SELECT * from stk_fs WHERE code IN (' + params.join(',') + ')', [...tickers])
        const pLItems = result.rows
        const output = {
            annualPnL: {}
        }
        for (let t of tickers) output.annualPnL[t] = []
        for (let i of pLItems) {
            const index = output.annualPnL[i.code].findIndex(s => s.year === i.year && s.qtr === i.qtr)
            if (index >= 0) {
                output.annualPnL[i.code][index][i.acc_code] = i.amt
                output.annualPnL[i.code][index][i.acc_code + '_base'] = i.base_amt
            } else {
                output.annualPnL[i.code].push({
                    code: i.code,
                    year: i.year,
                    qtr: i.qtr,
                    curr_code_rep: i.curr_code_rep,
                    [i.acc_code]: i.amt,
                    [i.acc_code + '_base']: i.base_amt
                })
            }
        }
        res.status(200).json(output)
    } catch (err) {
        next(err)
    }
}

exports.getRatios = async (req, res, next) => {
    const { tickers } = req.body
    if (tickers.length <= 0) return res.status(200).json({ ratios: {} })
    var params = [];
    for (var i = 1; i <= tickers.length; i++) {
        params.push('$' + i);
    }
    try {
        const result = await db.query('SELECT * from stk_ratio WHERE code IN (' + params.join(',') + ')', [...tickers])
        const ratiosList = result.rows
        const output = {
            ratios: {}
        }
        for (let t of tickers) output.ratios[t] = []
        for (let i of ratiosList) {
            const index = output.ratios[i.code].findIndex(s => s.year === i.year && s.qtr === i.qtr)
            if (index >= 0) {
                //output.data[i.code][index][i.ratio_code] = i.amt
                output.ratios[i.code][index][i.ratio_code + '_base'] = i.base_amt
            } else {
                output.ratios[i.code].push({
                    code: i.code,
                    year: i.year,
                    qtr: i.qtr,
                    curr_code_rep: i.curr_code_rep,
                    //[i.ratio_code]: i.amt,
                    [i.ratio_code + '_base']: i.base_amt
                })
            }
        }
        res.status(200).json(output)
    } catch (err) {
        next(err)
    }
}
