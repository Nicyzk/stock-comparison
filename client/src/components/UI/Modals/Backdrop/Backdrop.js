import React from 'react'
import './Backdrop.css'

const backdrop = (props) => {
    return (
        <div className='vh-100 vw-100 position-fixed top left bg-backdrop fl fl-justify-center fl-center-y'>
            {props.children}
        </div>
    )
}

export default backdrop