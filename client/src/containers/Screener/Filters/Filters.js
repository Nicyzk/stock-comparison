import React from 'react'
import { useSelector } from 'react-redux'
import Select from '../../../components/UI/Select/Select'
import screenerList from '../../../helpers/data/screener.json'
import './Filters.css'

const Filters = (props) => {
    const { tab, setTab, onFilterClicked } = props

    const screener = useSelector(state => state.screener)

    const renderTabs = () => {
        return Object.keys(screenerList).map((t, i) => (
            <div key={i} onClick={() => setTab(t)} className={`p-1 fs-14px screener-tab ${tab === t ? 'active' : null}`} role='button'>{t}</div>
        ))
    }

    const renderTabFilters = () => {
        return screenerList[tab].map((s, i) => {
            const index = screener.filters.findIndex(el => el.filter === s.filter)
            const value = index >= 0 ? screener.filters[index].criteria : ''
            return (
                <div key={i} className='mx-1'>
                    <Select value={value} setValue={(criteria) => onFilterClicked(s.filter, criteria)} options={s.options} label={s.label} />
                </div>
            )
        })
    }

    return (
        <>
            <div className='fl'>{renderTabs()}</div>
            <div className='filtersGrid p-1 fs-13px'>{renderTabFilters()}</div>
        </>
    )
}

export default Filters