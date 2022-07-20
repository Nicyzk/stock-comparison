import React from 'react'
import './MenuSlider.css'

const menuSlider = (props) => {
    const { iconClicked } = props
    const style = iconClicked ? { transform: "translateX(0%)" } : { transform: "translateY(-100%)" }
    return (
        <div className='slider slider-collapse-md bg-white left' style={style}>
            <div className='fl fl-col options-border-btm'>
                <div className='h-60px px-1 fl fl-justify-between fl-center-y'><a href="/">Home</a></div>
                <div className='h-60px px-1 fl fl-justify-between fl-center-y'><a href="/screener">Screener</a></div>
                <div className='h-60px px-1 fl fl-justify-between fl-center-y'><a href="/portfolio">Portfolio</a></div>
            </div>
        </div>

    )
}

export default menuSlider