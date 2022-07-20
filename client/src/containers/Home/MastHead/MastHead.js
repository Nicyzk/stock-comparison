import React from 'react'
import img480 from '../../../assets/img/business-vector-960.png'
import img960 from '../../../assets/img/business-vector-960.png'

const MastHead = () => {
    return (
        <div className='bg-lavender-diag px-1 pb-3 fl fl-wrap p-md-4 px-xl-6'>
            <div className='mx-auto w-md-40 w-70 order-md-2'>
                <img className='img' width='100' height='100' src={img960} srcSet={`${img480} 480w, ${img960} 960w`} alt='business-vector' />
            </div>
            <a href='https://pngtree.com/so/abstract'></a>
            <div className='text-center text-md-left w-md-60 order-md-1 fl fl-col fl-justify-center '>
                <span className='fs-1 fw-bold mb-1'><h1>Build your own stock comparison framework for free</h1></span>
                <div className='fs-4 text-secondary my-1 pb-3'><p>Access market data from international stock markets quickly and discover new investment opportunities</p></div>
                <div>
                    <a href='/screener'><button className='btn btn-purple'>Get Started</button></a>
                </div>
            </div>
        </div>
    )
}

export default MastHead