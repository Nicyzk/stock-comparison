const formatCell = (type, cell) => {
    let formatted
    switch (type) {
        case 'numeric': formatted = formatNum(cell)
            break
        case 'percentage': formatted = formatPercentage(cell)
            break
        default: formatted = cell
    }
    return formatted
}

const formatNum = (num) => {
    if (!num) return ''

    const str = String(num)
    let parts = str.split('.')

    let negative = ''
    if (parts[0][0] === '-') {
        parts[0] = parts[0].slice(1)
        negative = '-'
    }

    let value
    if (parts[0].length >= 13) {
        value = parts[0].slice(0, -12) + '.' + parts[0].slice(-12, -10) + 'T '
    }
    else if (parts[0].length >= 10) {
        value = parts[0].slice(0, -9) + '.' + parts[0].slice(-9, -7) + 'B '
    }
    else if (parts[0].length >= 7) {
        value = parts[0].slice(0, -6) + '.' + parts[0].slice(-6, -4) + 'M '
    }
    else if (parts[0].length >= 4) {
        value = parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    else {
        if (parts[1]) { parts[1] = parts[1].length === 1 ? parts[1] = parts[1] + '0' :parts[1].slice(0, 2) } 
        else parts.push('00')
        value = parts.join(".");
    }

    return negative + value
}

const formatPercentage = (num) => {
    console.log(num)
    if (!num) return ''
    let percent = (parseFloat(num) * 100).toFixed(2)
    percent = String(percent) + '%'
    return percent
}

const APIPath = () => {
    // return 'http://localhost:3001/api' // development
    return '/api' // production
}

export { formatCell, formatNum, APIPath }