import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const pagination = (props) => {
    const { page, setPage, pages, clicked } = props
    const renderPgNo = (pages) => {
        let no = []
        for (let i = 1; i <= pages; i++) {
            no.push(<div key={i} onClick={() => setPage(i) && clicked()} className={`text-center px-1 ${i === page ? 'fw-bold text-purple': ''}`} role='button'>{i}</div>)
        }
        return no
    }
    return (
        <div className='pagination fl fl-center-y inline-fl'>
            <IoIosArrowBack onClick={() => page > 1 ? setPage(page - 1) && clicked(): null} className='mx-1' role='button'/>
            {renderPgNo(pages)}
            <IoIosArrowForward onClick={() => page < pages ? setPage(page + 1) && clicked(): null} className='mx-1' role='button'/>
        </div>
    )
}

export default pagination