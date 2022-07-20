import React from 'react'
import Layout from '../../components/Layout/Layout'
import MastHead from './MastHead/MastHead'
import Products from './Products/Products'
import Benefits from './Benefits/Benefits'

const Home = () => {

    return (
        <Layout>
            <MastHead />
            <Products/>
            <Benefits/>
            {/* Get Started */}
            <div>
                <div className='text-center py-3 mx-auto'>
                    <p className='fs-4 fw-bold py-3'>Ready to get started?</p>
                    <div className='pb-3'>
                        <a href='/screener'><button className='btn btn-purple mx-1'>Get Started</button></a>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home