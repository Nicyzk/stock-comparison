import { formatNum } from './util'
import columnStats from './data/columnStats.json'

const createTable = (columns, tickers, { data, period }) => {
    const table = []

    for (let ticker of tickers) {
        let temp = {}

        const stock = data[ticker]
        
        let pnl, ratio
        if (period) {
            const statements = data[ticker].pL
            pnl = statements.filter(s => s.year.slice(0, 4) === period)[0]
            if (!pnl) pnl = {}
            const ratios = data[ticker].ratios
            ratio = ratios.filter(s => s.year.slice(0, 4) === period)[0]
            if (!ratio) ratio = {}
        }
        for (let col of columns) {
            const { location, key } = columnStats[col].whrInData
            if (location === "stock") { 
                /******Exception for price. Since one col has two values.*******/
                if (col === 'Price') { temp[col] = formatNum(stock[key]) + ' | ' + formatNum(stock[key]/stock.ex_rate)}

                else { temp[col] = stock[key] }
            }
            else if (location === "pnl") { // pnl is a key in stock
                temp[col] = pnl[key] 
            }
            else if (location === "ratios") {
                temp[col] = ratio[key]
            }
        }
        const row = columns.map(col => temp[col])
        table.push(row)

    }

    return table
}



export default createTable
