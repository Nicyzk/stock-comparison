const db = require('../util/db')
const { generateConditions, generateOrder } = require('../util/screener/helper')

exports.screen = async (req, res, next) => {

    const { filters, page, limit, sort } = req.body
    let values = []
    const conditions = generateConditions(filters, values)
    const order = generateOrder(sort)
    const offset = (page - 1) * limit

    let text = `
        SELECT * from stk 
        JOIN stk_price
        ON stk.code = stk_price.code
        join currency
        on stk.curr_code_ex = currency.curr_code and LEFT(stk_price.date, 4) = currency.year
        WHERE ${conditions} date=(SELECT max(date) from stk_price)
        ORDER BY ${order}
    `
    try {
        const result = await db.query(text, values)
        const screened = result.rows
        let selection = [], max = screened.length
        for (let i = 0; i < limit; i++) {
            if ((offset + i) < max) selection.push(screened[offset + i])
        }

        const output = {
            profile: {},
            total: screened.length
        }

        selection.forEach(el => {
            output.profile[el.code] = el
        })

        res.status(200).json(output)
    } catch (err) {
        next(err)
    }
}