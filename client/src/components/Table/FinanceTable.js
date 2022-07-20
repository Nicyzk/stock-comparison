import React from 'react'
import { HdrCheckBox, RowCheckBox } from './CheckBox/CheckBoxes' 
import createTable from '../../helpers/createTable'
import columnStats from '../../helpers/data/columnStats.json'
import { formatCell } from '../../helpers/util'
import { FaSort } from 'react-icons/fa'

// Features: 
// 1) Create and render table according to columns, tickers and data
// 2) Row Selection 4
// 3) Set sorting to opposite of previous sort (NO sorting functionality)

const FinanceTable = (props) => {

    const { columns, tickers, sort, setSort, selectedRows, setSelectedRows, details } = props

    const { data, period } = details
    const table = createTable(columns, tickers, { data, period })

    const renderTableBody = (table, columns) => {
        return table.map((row, rowIndex) => {
            return (
                <tr key={rowIndex}>
                    {row.map((cell, index) => (
                        <td key={index} className={`${columnStats[columns[index]].alignRight ? 'text-right' : ''}`}>
                            {index === 0 ? <RowCheckBox index={rowIndex} selectedRows={selectedRows} setSelectedRows={setSelectedRows} /> : null}
                            {formatCell(columnStats[columns[index]].type, cell)}
                        </td>
                    ))}
                </tr>
            )
        })
    }

    return (
        <div className='table-responsive my-1'>
            <table className='table table-1st-col-sticky table-striped table-bordered-between fs-13px w-100'>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>
                                <div>
                                    {index === 0 ? <HdrCheckBox rowCount={tickers.length} selectedRows={selectedRows} setSelectedRows={setSelectedRows} /> : null}
                                    {col}
                                    <FaSort onClick={() => setSort({ col: columns[index], order: sort.order === 'desc' ? 'asc' : 'desc' })} className='icon sort-icon' role='button' />
                                    <div className='fs-10px text-secondary'>{columnStats[col].units}</div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody(table, columns)}
                </tbody>
            </table>
        </div>
    )
}

export default FinanceTable