import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import './Alert.css'

const Alert = (props) => {
    const [show, setShow] = useState(true)
    return show ? (
        <div className='alert-primary p-1 fl fl-justify-between fl-center-y w-100'>
            <div>{props.children}</div>
            <IoMdClose role='button' onClick={() => setShow(false)}/>
        </div>
    ) : null
}

export default Alert