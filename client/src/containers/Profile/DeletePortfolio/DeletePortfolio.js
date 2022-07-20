import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../../components/UI/Modals/Modal/Modal'
import { deletePortfolio } from '../../../store/actions/profile'

const DeletePortfolio = (props) => {
    const { portfolio } = props
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)

    const onClose = () => setShow(false)

    const onDeleteClicked = () => {
        dispatch(deletePortfolio({name: portfolio.name, profile, auth }))
        onClose()
    }

    return (
        <>
            <button className='bs-btn btn-outline-danger' onClick={() => setShow(true)}>Delete</button>
            <Modal
                show={show}
                onClose={onClose}
                btnText='Confirm'
                onBtnClick={onDeleteClicked}>
                <div className='fl fl-col'>
                    <h2 className='fw-bold text-center my-1'>Are you sure?</h2>
                    <p className='text-secondary my-1'>All stocks in this portfolio will be deleted.</p>
                </div>
            </Modal>
        </>
    )
}

export default DeletePortfolio