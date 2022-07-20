import React from 'react'
import { useDispatch } from 'react-redux'
import Backdrop from '../Backdrop/Backdrop'
import { BsExclamationTriangle } from 'react-icons/bs'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { IoMdClose } from 'react-icons/io'
import './StatusModal.css'

const StatusModal = (props) => {
    const { error, success } = props.status
    const dispatch = useDispatch()
    const onClose = () => {
        // This action is not defined but will still clear error. 
        dispatch({
            type: 'CLEAR_STATUS'
        })
    }

    let errorMessage 
    if (error) errorMessage = error.response ? error.response.data.message : error.message

    return error || success ? (
        <Backdrop>
            <div className='bg-white p-1'>
                <div className='text-right'>
                    <IoMdClose className='close-btn' role='button' onClick={onClose} />
                </div>
                <div className='fl fl-col fl-col-center-x px-md-1'>
                    {error ?
                        <BsExclamationTriangle className='icon-lg text-muted' />
                        : <IoCheckmarkCircleOutline className='icon-lg text-success' />}
                    <div className='fs-3 fw-bold my-1 text-center'>{error ? 'Something went wrong!' : 'Operation successful!'}</div>
                    <div className='text-secondary mb-1 text-center'>{error ? errorMessage : success}</div>
                    <button className='btn btn-purple my-1' onClick={onClose}>Go Back</button>
                </div>
            </div>
        </Backdrop>
    ) : null
}

export default StatusModal