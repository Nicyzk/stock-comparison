const insertRatiosIntoDB = async (client, data) => {

    // Create new table. 
    const { ticker, pl, bs } = data

    for (let i = 0; i < pl.length; i++) {

        // if 'update', ignore fs that already exist in DB: NOT TESTED
        if (!data.FSToUpdate(pl[i])) { continue }

        const p = pl[i]
        const { year, reportedCurrency, revenue, grossProfit, operatingIncome, incomeAttrShareholders } = p

        const compute = (dep, formula) => {
            if (dep.every(el => el)) {
                return formula(...dep)
            } else {
                return null
            }
        }
        // Gross Profit Margin
        const GPM = compute([grossProfit, revenue], (gp, rev) => gp / rev)

        // Operating Profit Margin 
        const OPM = compute([operatingIncome, revenue], (op, rev) => op / rev)

        // Net Profit Margin 
        const NPM = compute([incomeAttrShareholders, revenue], (inc, rev) => inc / rev)

        const b = bs.find(s => s.year === p.year)
        // Sometimes, there may be more years in BS than PL. As long as we have 3 years of data, allow to fail. 
        if (i >= 2 && !b) return

        const { totalAssets, currentAssets, inventory, totalLiabilities, currentLiabilities, totalEquity, noShares } = b

        // Debt-to-equity
        const DtoE = compute([totalLiabilities, totalEquity], (tl, te) => tl / te)

        // Debt-to-asset 
        const DtoA = compute([totalLiabilities, totalAssets], (tl, ta) => tl / ta)

        // Current Ratio 
        const CR = compute([currentAssets, currentLiabilities], (ca, cl) => ca / cl)

        // Quick Ratio 
        const QR = compute([currentAssets, inventory, currentLiabilities], (ca, inv, cl) => (ca - inv) / cl)

        // 3-year Revenue & EPS growth
        let pnl3yr = pl.find(el => (parseInt(p.year.slice(0, 4)) - 3) === parseInt(el.year.slice(0, 4)) )
        let rev3yrCagr = null
        let inc3yrCagr = null
        if (pnl3yr) {
            rev3yrCagr = compute([revenue, pnl3yr.revenue], (rev, rev3yr) => Math.cbrt( rev / rev3yr ) - 1)
            inc3yrCagr = compute([incomeAttrShareholders, pnl3yr.incomeAttrShareholders], (inc, inc3yr) => Math.cbrt( inc / inc3yr ) - 1)
        }

        let text = `select * from currency where curr_code=$1 and year=$2`
        let values = [reportedCurrency, year.slice(0, 4)]
        const result = await client.query(text, values)
        const ex_rate = result.rows[0].ex_rate

        // EPS
        const EPS = compute([incomeAttrShareholders, noShares], (inc, shares) => inc / shares)
        const EPS_base = compute([incomeAttrShareholders, noShares], (inc, shares) => (inc / ex_rate) / shares)

        text = `
            insert into stk_ratio (
                code, year, qtr, ratio_code, curr_code_rep, amt, base_amt
            ) values (
                $1, $2, $3, $4, $5, $6, $7
            )
        `

        values = [ticker, year, 'FY', 'gpm', reportedCurrency, null, GPM]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'opm', reportedCurrency, null, OPM]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'npm', reportedCurrency, null, NPM]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'DtoE', reportedCurrency, null, DtoE]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'DtoA', reportedCurrency, null, DtoA]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'cr', reportedCurrency, null, CR]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'qr', reportedCurrency, null, QR]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'eps', reportedCurrency, EPS, EPS_base]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'rev3yrCagr', reportedCurrency, null, rev3yrCagr]
        await client.query(text, values)

        values = [ticker, year, 'FY', 'inc3yrCagr', reportedCurrency, null, inc3yrCagr]
        await client.query(text, values)
    }

}

module.exports = { insertRatiosIntoDB }