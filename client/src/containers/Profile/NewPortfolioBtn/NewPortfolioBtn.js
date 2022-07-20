import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { createNewPortfolio } from '../../../store/actions/profile'
import Modal from '../../../components/UI/Modals/Modal/Modal'

const CreatePortfolioBtn = (props) => {
    const { profile, auth } = props
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [name, setName] = useState('')

    const onClose = () => {
        setShow(false)
        setName('')
    }

    const onCreateClicked = () => {
        dispatch(createNewPortfolio({ name, profile, auth }))
        onClose()
    }

    return (
        <>
            <button onClick={() => setShow(true)} className='bs-btn btn-outline-purple'><AiOutlineFileAdd className='icon' /> New</button>
            <Modal
                show={show}
                onClose={onClose}
                btnText='Create'
                onBtnClick={onCreateClicked}>
                <div className='fl fl-col'>
                    <label htmlFor='list-name'>Portfolio Name</label>
                    <input id='list-name' value={name} onChange={e => setName(e.target.value)} className='w-100 fs-5 my-1' type='text'/>
                </div>
            </Modal>
        </>
    )
}

export default CreatePortfolioBtn