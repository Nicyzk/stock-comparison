import React, { useState } from 'react'
import Modal from '../../../components/UI/Modals/Modal/Modal'
import { IoIosAddCircleOutline } from 'react-icons/io'
import columnStats from '../../../helpers/data/columnStats.json'
import './CreateTemplate.css'

const CreateTemplate = (props) => {
    const [templateName, setTemplateName] = useState('Untitled Template')
    const [selection, setSelection] = useState(['Company'])
    const [showModal, setShowModal] = useState(false)

    const { templates, setTemplates } = props

    const onClose = () => {
        setSelection(['Company'])
        setTemplateName('Untitled Template')
        setShowModal(false)
    }

    const onCheckBoxClicked = (col) => {
        let updated = [...selection]
        const index = selection.indexOf(col)
        if (index >= 0) {
            updated.splice(index, 1)
        } else {
            updated.push(col)
        }
        setSelection(updated)
    }

    const onCreateClicked = () => {
        const updated = [...templates]
        updated.push({ name: templateName, columns: selection })
        setTemplates(updated)
        onClose()
    }

    const renderSelection = () => {
        return (
            <div className='fl fl-wrap fl-center-y'>
                <label className='fs-5 fw-bold text-purple my-1 mr-1'>Selection: </label>
                {selection.map((el, index) => (
                    <div
                        key={index}
                        className='px-1 py-05 fs-14px mr-1 text-primary border-light br-5px'>{el}</div>
                ))}
            </div>
        )
    }

    return (
        <>
            <button className='btn btn-purple w-100 w-sm-auto' onClick={() => setShowModal(true)}>
                <IoIosAddCircleOutline className='icon add-icon' /><span>Create new tab</span>
            </button>
            <Modal
                show={showModal}
                onClose={onClose}
                btnText='Create Template'
                onBtnClick={onCreateClicked}>
                <div>
                    <div className='text-center'>
                        <input className='text-center fs-4 fw-bold' type='text' value={templateName} onChange={e => setTemplateName(e.target.value)} />
                    </div>
                    {renderSelection()}
                    <div className='w-100 mb-1 indicatorContainer'>
                        {Object.keys(columnStats).map((col, index) => (
                            col === 'Company' ? null : (
                                <div className='py-05 fl' key={index}>
                                    <span><input type='checkbox' onClick={() => onCheckBoxClicked(col)} />{col}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default CreateTemplate