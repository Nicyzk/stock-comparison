import React from 'react'
import { FcServices, FcComboChart, FcInspection } from 'react-icons/fc'
import './Benefits.css'

const benefits = () => {
    return (
        <div className='p-1 py-3 px-lg-2 bg-alice-blue'>
            <div className='text-center my-2 w-md-50 mx-auto'>
                <h2 className='fs-3 fw-bold '>Looking for new investment opportunities?</h2>
            </div>
            <div className='fl fl-wrap fl-justify-center py-125'>
                <div className='fl fl-col bg-white shadow text-center benefit-card'>
                    <div className='text-center'><FcComboChart /></div>
                    <h3 className='text-purple'>Global Perspective</h3>
                    <p>Explore investment opportunities by screening through stocks from exchanges all around the world.</p>
                </div>
                <div className='fl fl-col bg-white shadow text-center benefit-card'> 
                    <div className='text-center'><FcServices /></div>
                    <h3 className='text-purple'>Customizable and simple-to-use</h3>
                    <p>Create your own portfolio and compare stocks quickly and easily with your favourite indicators.</p>
                </div>
                <div className='fl fl-col bg-white shadow text-center benefit-card'>
                    <div className='text-center'><FcInspection /></div>
                    <h3 className='text-purple'>Completely Free</h3>
                    <p>All tools and financial data on this website are absolutely free. </p>
                </div>
            </div>
        </div>
    )
}

export default benefits