import React, { useRef } from 'react'
import { BsSearch } from 'react-icons/bs'
import './SearchBar.css'

const SearchBar = (props) => {
    const { recommendations, search, setSearch, onResultClicked, placeholder } = props
    const searchRef = useRef(null)
    if (searchRef.current) {
        if (recommendations.length > 0) searchRef.current.classList.add('showResults')
        else searchRef.current.classList.remove('showResults')
    }
    
    return (
        <div ref={searchRef} className='search position-relative my-1 w-100 w-sm-300px'>
            <div className='search-bar fl fl-center-y border-light'>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={placeholder} required />
                <span className='fl fl-justify-center fl-center-y'><BsSearch /></span>
            </div>
            <div className='results w-100'>
                {recommendations.map((el, index) => (
                    <div onClick={onResultClicked} key={index} className='result' value={el.value}>{el.text}</div>
                ))}
            </div>
        </div>
    )
}

export default SearchBar