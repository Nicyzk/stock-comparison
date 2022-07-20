import React, { useRef } from 'react'
import { IoIosArrowUp } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'
import './Select.css'

const Select = (props) => {
    const { value, setValue, options, label } = props
    const selectRef = useRef(null)
    const onSelectBtnClicked = () => {
        selectRef.current.classList.toggle('showOptions')
    }
    const onOptionClicked = (option) => {
        selectRef.current.classList.remove('showOptions')
        setValue(option.id)
    }

    return (
        <div className='fl fl-justify-between fl-center-y'>
            <label className='mr-1'>{label}</label>
            <div ref={selectRef} className='select position-relative'>
                <div className='select-button bg-white br-5px' onClick={onSelectBtnClicked}>
                    <div className='mr-1'><span>{options.find(o => o.id === value).name}</span></div>
                    <div className='chevrons'>
                        <IoIosArrowUp />
                        <IoIosArrowDown />
                    </div>
                </div>
                <div className='options'>
                    {options.map((option, index) => (
                        <div className='option' key={index} onClick={() => onOptionClicked(option)}>{option.name}</div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default Select