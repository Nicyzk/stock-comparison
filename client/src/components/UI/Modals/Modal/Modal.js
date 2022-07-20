import React from 'react'
import Backdrop from '../Backdrop/Backdrop'
import { IoMdClose } from 'react-icons/io'
import './Modal.css'

// Note: This modal is separate from error modal. 
const modal = (props) => {
    const { onClose, onBtnClick, btnText, show } = props
    return show ? (
        <Backdrop>
            <div className='bg-white p-1'>
                <div className='text-right'>
                    <IoMdClose className='close-btn text-muted' role='button' onClick={onClose} />
                </div>
                <div className='fl fl-col fl-col-center-x px-md-1'>
                    <div>
                        {props.children}
                    </div>
                    <div className='w-100 text-right'>
                        <button className='btn bg-white text-primary mx-1 my-1' onClick={onClose}>Cancel</button>
                        <button className='btn btn-purple my-1' onClick={onBtnClick}>{btnText}</button>
                    </div>
                </div>
            </div>
        </Backdrop>
    ) : null
}

export default modal