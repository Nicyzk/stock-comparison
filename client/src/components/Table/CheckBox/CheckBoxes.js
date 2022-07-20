import React from 'react'

// How it works. When none ticked, selectedRows = []. As there are ticked, indexes are pushed into selectedRows. 

const HdrCheckBox = (props) => {
    const { rowCount, selectedRows, setSelectedRows } = props
    const checkBoxClicked = () => {
        if (selectedRows.length === rowCount) { setSelectedRows([]) }
        else { 
            const updated = []
            for (let i = 0; i < rowCount; i++) {
                updated.push(i)
            }
            setSelectedRows(updated)
        }
    }
    let checked = false
    if (selectedRows.length === rowCount && rowCount > 0) checked = true
    return (
        <input type='checkbox' onChange={checkBoxClicked} checked={checked} />
    )
}

const RowCheckBox = (props) => {
    const { selectedRows, setSelectedRows, index } = props
    return (
        <input type='checkbox' checked={selectedRows.includes(index) ? true: false} onChange={() => {
            const updated = [...selectedRows]
            const pos = updated.indexOf(index)
            pos >= 0 ? updated.splice(pos, 1): updated.push(index)
            setSelectedRows(updated)
        }} />
    )
}

export { HdrCheckBox, RowCheckBox }