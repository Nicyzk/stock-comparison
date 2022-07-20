const commands = require('./commands.json')

exports.generateConditions = (filters, values) => {
    let conditions = ''
    if (filters.length > 0) {
        let temp = []
        let param = 0
        filters.forEach(s => { 
            if (!commands[s.filter]) {
                temp.push(`${s.filter}=\$${++param}`) && values.push(s.criteria) 
            } else {
                if (commands[s.filter].table === 'stk_ratio') {
                    let command = commands[s.filter][s.criteria]
                    let statement = `stk.code in (
                        select code from stk_ratio as a
                        where ratio_code='${s.filter}' and ${command} and 
                        year = (select max(year) from stk_ratio as b where b.code = a.code group by code)
                    )`
                    temp.push(statement)
                } else temp.push(commands[s.filter][s.criteria])
            }
        })
        conditions = temp.join(' AND ') + ' AND '
    }
    return conditions
}

exports.generateOrder = (sort) => {
    let order = ''
    switch (sort.col) {
        case 'Company': order += 'name'
            break
        case 'EX': order += 'exchange'
            break
        case 'Price': order += 'price'
            break
        case 'Price Change': order += 'price_change'
            break
        case 'Price Target': order += 'price_target'
            break
        case 'Volume': order += 'vol'
            break
        case 'Average Volume': order += 'ave_vol'
            break
        case 'Market Cap': order += 'cap_base'
            break
        case 'Sector': order += 'sector'
            break
        default: order += 'name'
    }
    if (sort.order === 'asc') order += ' asc'
    if (sort.order === 'desc') order += ' desc'
    return order
}
