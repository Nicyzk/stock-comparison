import React from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import './DeleteRowBubble.css'

const deleteRowBubble = (props) => {
    const { selectedRows, setSelectedRows, tickers, removeTickers } = props
    const count = selectedRows.length
    const onDeleteClicked = () => {
        const toRemove = []
        for (let i of selectedRows) {
            toRemove.push(tickers[i])
        }
        removeTickers(toRemove)
        setSelectedRows([])
    }
    let style = {}
    if (count > 0) {
        style.display = 'flex'
    } else {
        style.display = 'none'
    }
    return (
        <div className='position-relative fw-bold'>
            <div style={style} className='delete-row-bubble position-absolute bottom left w-100 py-125 px-1 text-white bg-primary fl fl-justify-between fl-center-y'>
                <span>{count} items selected</span>
                <span role='button' onClick={onDeleteClicked}>Delete <RiDeleteBin6Line className='icon' /></span>
            </div>
        </div>
    )
}

export default deleteRowBubble

