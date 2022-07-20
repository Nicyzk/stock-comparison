import React from 'react'
import SearchBar from '../../../components/UI/SearchBar/SearchBar'

const SearchTickers = (props) => {
    const { list, search, setSearch, addTicker } = props
    let filtered = [], recommendations = []
    if (search !== '') filtered = list.filter(el => (el.ticker.toLowerCase().indexOf(search.toLowerCase()) !== -1) || (el.name.toLowerCase().indexOf(search.toLowerCase()) !== -1))
    recommendations = filtered.map(el => ({value: el.ticker, text: el.name}))
    const placeholder = 'Search for a ticker...'

    const onResultClicked = (e) => {
        setSearch('')
        addTicker([e.target.getAttribute('value')])
    }

    return (
        <SearchBar 
        recommendations={recommendations}
        search={search}
        setSearch={setSearch}
        placeholder={placeholder}
        onResultClicked={onResultClicked}/>
    )
}

export default SearchTickers