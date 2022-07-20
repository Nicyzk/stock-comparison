import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { getScreenerData, setExportingTickers } from '../../store/actions/screener'
import Filters from './Filters/Filters'
import FinanceTable from '../../components/Table/FinanceTable'
import Pagination from '../../components/UI/Pagination/Pagination'
import '../../components/Table/Table.css'

const Screener = () => {

    const [tab, setTab] = useState('Descriptive')
    const [sort, setSort] = useState({ col: 'Company', order: 'asc' })
    const [selectedRows, setSelectedRows] = useState([])
    const dispatch = useDispatch()
    const screener = useSelector(state => state.screener)
    const columns = ['Company', 'EX', 'Price', 'Price Change', 'Price Target', 'Volume', 'Average Volume', 'Market Cap', 'Sector']
    const limit = 15

    useEffect(() => {
        dispatch(getScreenerData({
            filters: screener.filters,
            page: screener.page,
            limit,
            sort
        }))
    }, [sort])

    const onFilterClicked = (filter, criteria) => {
        const updated = [...screener.filters]
        const index = updated.findIndex(c => c.filter === filter)
        if (criteria === '' && index >= 0) updated.splice(index, 1)
        if (criteria) index >= 0 ? updated[index].criteria = criteria : updated.push({ filter, criteria })
        setSelectedRows([])
        dispatch(getScreenerData({
            filters: updated,
            page: 1,
            limit,
            sort
        }))
    }


    const onPageChange = (newPage) => {
        setSelectedRows([])
        dispatch(getScreenerData({
            filters: screener.filters,
            page: newPage,
            limit,
            sort
        }))
    }

    const tickers = Object.keys(screener.data)
    const details = { data: screener.data }
    const selectedTickers = selectedRows.sort().map(i => tickers[i])

    return (
        <div className='bg-light min-vh-100'>
            <Layout>
                <div className='py-125 px-md-1 px-lg-3 px-xl-5'>
                    <div className='fs-5 fw-bold p-1'><h1>Stock Screener</h1></div>
                    <div className='bg-white shadow p-1 px-lg-2'>
                        <Filters tab={tab} setTab={setTab} onFilterClicked={onFilterClicked} />
                        <FinanceTable columns={columns} tickers={tickers} sort={sort} setSort={setSort}
                            selectedRows={selectedRows} setSelectedRows={setSelectedRows} details={details} />
                        <div className='fl fl-justify-between fl-center-y'>
                            <Pagination page={screener.page} setPage={(page) => onPageChange(page)} pages={Math.ceil(screener.total / limit)} />
                            <Link to='/screener/export'>
                                <button className='btn btn-purple' disabled={selectedRows.length <= 0} onClick={() => dispatch(setExportingTickers({ exporting: selectedTickers }))}>Export to Portfolio</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        </div >
    )
}

export default Screener


// Important: Filter is the filter code while sort.col is screener table column. Totally separate. 