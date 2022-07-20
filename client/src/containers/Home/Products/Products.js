import React from 'react'
import screenerImg496 from '../../../assets/img/screener-496.png'
import screenerImg992 from '../../../assets/img/screener-992.png'
import portfolioImg496 from '../../../assets/img/portfolio-496.png'
import portfolioImg992 from '../../../assets/img/portfolio-992.png'
import { BiRadioCircle } from 'react-icons/bi'
import './Products.css'

const Products = () => {

    const screenerFeatures = [
        'Explore stocks from a range of markets in countries like China, Hong Kong, Singapore, UK, US etc',
        'Financial data is denominated in a common currency for fair screening',
        'Allows you to export selected screened stocks into your personal portfolio for further comparison'
    ]
    const portfolioFeatures = [
        'Compare stocks in your portfolio with the indicators you like',
        'Popular stock portfolios categorised by index and sector etc for your selection',
        'Template indicators available for easy set-up'

    ]

    const renderImg = (srcList, width, height, alt, ordermd) => {
        return (
            <div className={`mx-auto my-1 w-md-50 fl fl-center-y ${ordermd === 2 ? 'order-md-2 fl-justify-center' : null}`}>
                <img width={width} height={height} className='pdt-img shadow' src={srcList[1]} srcSet={`${srcList[0]} 496w, ${srcList[1]} 992w`} alt={alt} />
            </div>
        )
    }

    const renderDesc = (hdr, features, ordermd) => {
        return (
            <div className={`fl fl-col mx-auto w-md-50 ${ordermd === 1 ? 'order-md-1' : null} `}>
                <h2 className='fs-4 fw-bold text-center text-purple text-md-left'>{hdr}</h2>
                <ul className='list-unstyled text-left text-secondary'>
                    {features.map((text, index) => (
                        <li key={index} className='position-relative px-1'>
                            <BiRadioCircle className='text-purple list-radio position-absolute left' />
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className='px-1 py-3 px-lg-6 px-xl-10'>
            <div className='text-center mx-auto w-md-60'>
                <h1 className='fs-2 fw-bold my-3'>We provide the best tools for you to explore new markets and compare investments</h1>
                <p className='fs-5 text-secondary'>
                    If you are an investor looking for new opportunities or ways to diversify your investments, we have the financial data and tools just for you.
                </p>
            </div>
            <div className='fl fl-wrap py-3'>
                {renderImg([screenerImg496, screenerImg992], '100', '58', 'screener-tool', 1)}
                {renderDesc('International Stock Screener', screenerFeatures, 2)}
            </div>
            <div className='fl fl-wrap py-3'>
                {renderImg([portfolioImg496, portfolioImg992], '100', '52', 'comparison tool and portfolio', 2)}
                {renderDesc('Comparison Tool and Portfolio', portfolioFeatures, 1)}
            </div>
        </div>
    )
}

export default Products