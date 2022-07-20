import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { setPortfolio } from '../../store/actions/portfolio'
import { addToPortfolio, removeFromPortfolio } from '../../store/actions/profile'
import Templates from './Templates/Templates'
import SearchTickers from './SearchTickers/SearchTickers'
import CreateTemplate from './CreateTemplate/CreateTemplate'
import Select from '../../components/UI/Select/Select'
import DeleteRowBubble from './DeleteRowBubble/DeleteRowBubble'
import FinanceTable from '../../components/Table/FinanceTable'
import createTable from '../../helpers/createTable'
import tickerNameList from '../../helpers/data/searchTicker.json'
import '../../components/Table/Table.css'

const Portfolio = () => {
    const [sort, setSort] = useState({ col: '', order: '' })
    const [templates, setTemplates] = useState([
        { name: 'Overview', columns: ['Company', 'EX', 'Sector', 'Price', 'Price Change', 'Price Target', 'Volume', 'Market Cap', 'PE Ratio'] },
        { name: 'Descriptive', columns: ['Company', 'EX', 'Market Cap', 'Industry', 'Sector', 'Full Time Employees'] },
        { name: 'Revenue and Earnings', columns: ['Company', 'Sector', 'Revenue', 'Gross Profit', 'Gross Margin', 'Oper. Income', 'Oper. Margin', 'Earnings', 'Profit Margin'] },
        { name: 'Price Ratios', columns: ['Company', 'EX', 'Sector', 'Price', 'EPS', 'PE Ratio', 'PS Ratio', 'PB Ratio'] },
        { name: 'Debt Ratios', columns: ['Company', 'Sector', 'Debt-to-Equity', 'Debt-to-Asset', 'Current Ratio', 'Quick Ratio'] }
    ])
    const [currentTemplate, setCurrentTemplate] = useState('Overview')
    const [selectedRows, setSelectedRows] = useState([])
    const [search, setSearch] = useState('')
    const [period, setPeriod] = useState('2020')
    const portfolio = useSelector(state => state.portfolio)
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)
    const dispatch = useDispatch()
    const history = useHistory()
    const query = new URLSearchParams(useLocation().search)

    useEffect(() => { 
        (async () => {
            const name = query.get('name')
            const isFound = await dispatch(setPortfolio({ name, profile }))
            if (!isFound) {
                if (profile.user.portfolios[0]) {
                    history.replace(`/portfolio/?name=${profile.user.portfolios[0].name}`)
                    dispatch(setPortfolio({ name: profile.user.portfolios[0].name, profile }))
                }
            }
        })()
    }, [])

    const firstUpdate = useRef(true)
    const selectedProfilePortfolio = profile.user.portfolios.find(p => p.name === portfolio.name)
    useEffect(() => {  // After first mount, if selected portfolio in profile is updated (added/removed), update portfolio. 
        if (firstUpdate.current) { firstUpdate.current = false }
        else {
            console.log('second render onwards')
            dispatch(setPortfolio({ name: portfolio.name, profile }))
        }
    }, [selectedProfilePortfolio])

    const addTickers = (toAdd) => {
        dispatch(addToPortfolio({ name: portfolio.name, tickers: toAdd, profile, auth }))
    }

    const removeTickers = (toRemove) => {
        dispatch(removeFromPortfolio({ name: portfolio.name, tickers: toRemove, profile, auth }))
    }

    const sortTickers = (tickers, sort) => {
        if (!sort.col) return tickers
        const columns = [sort.col]
        const temp = createTable(columns, tickers, { data: portfolio.data, period })
        temp.forEach((row, i) => row.push(tickers[i]))

        if (sort.order === 'asc') { // Note 2
            temp.sort((a, b) => String(!a[0] ? '' : a[0]).localeCompare(String(!b[0] ? '' : b[0]), 'en', { numeric: true }))
        }
        else {
            temp.sort((a, b) => -String(!a[0] ? '' : a[0]).localeCompare(String(!b[0] ? '' : b[0]), 'en', { numeric: true }))
        }
        const sortedTickers = temp.map(row => row[row.length - 1])
        return sortedTickers
    }

    if (portfolio.loading) return null
    const tickers = portfolio.tickers 
    const columns = templates.find(el => el.name === currentTemplate).columns
    const sortedTickers = sortTickers(tickers, sort)
    const details = { data: portfolio.data, period }

    return (
        <div className='bg-lavender min-vh-100'>
            <Layout>
                <div className='py-125 px-md-1 px-lg-3 px-xl-5'>
                    <div className='p-1 fl fl-justify-between fl-center-y'>
                        <span className='fs-5 fw-bold'>{portfolio.name}</span>
                        <Link to='/profile'><button className='btn bg-white text-purple mx-1'>My Portfolios</button></Link>
                    </div>
                    <span className='fs-14px mt-0 mx-1'>Prices last updated: {Object.keys(portfolio.data).length >= 1 ? new Date(portfolio.data[sortedTickers[0]].date).toLocaleDateString(): null}</span>
                    <div className='bg-white shadow p-1 px-lg-2 my-1'>
                        <div>
                            <div className='fl fl-col fl-sm-row fl-justify-between fl-center-y'>
                                <Templates templates={templates} setCurrentTemplate={setCurrentTemplate} />
                                <CreateTemplate templates={templates} setTemplates={setTemplates} />
                            </div>
                            <div className='fl fl-col fl-sm-row fl-justify-between fl-center-y fs-14px'>
                                <SearchTickers list={tickerNameList} search={search} setSearch={setSearch} addTicker={addTickers} />
                                <Select value={period} setValue={setPeriod} label='Period' options={[{ id: "2020", name: "2020" }, { id: "2019", name: "2019" }, { id: "2018", name: "2018" }]} />
                            </div>
                        </div>
                        <DeleteRowBubble selectedRows={selectedRows} setSelectedRows={setSelectedRows} tickers={sortedTickers} removeTickers={removeTickers} />
                        <FinanceTable columns={columns} tickers={sortedTickers} sort={sort} setSort={setSort}
                            selectedRows={selectedRows} setSelectedRows={setSelectedRows} details={details} />
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Portfolio



/******************************************************************
 * Note 1: To get new arrangement of tickers, push ticker into row.
 * Note 2: If a[index] or b[index] is null, convert to ''. Else 'null' is > than '123'
 * *****************************************************************/