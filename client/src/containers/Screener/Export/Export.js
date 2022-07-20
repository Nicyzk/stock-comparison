import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Layout from '../../../components/Layout/Layout'
import Alert from '../../../components/UI/Alert/Alert'
import NewPortfolioBtn from '../../Profile/NewPortfolioBtn/NewPortfolioBtn'
import { getUserPortfolios } from '../../../store/actions/profile'
import { addToPortfolio } from '../../../store/actions/profile'
import { IoChevronDownOutline } from 'react-icons/io5'

// Features: 1) Imitation of profile page. 2) Updates portfolio with exportng tickers. 3) Select and navigate to portfolio. 
const Export = () => {
    const profile = useSelector(state => state.profile)
    const screener = useSelector(state => state.screener)
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const history = useHistory()

    const [addedTo, setAddedTo] = useState([])

    useEffect(() => {
        if (auth.token) {
            dispatch(getUserPortfolios())
        }
    }, [])

    const onAddToPortfolioClicked = async (p) => {
        const isAdded = await dispatch(addToPortfolio({ name: p.name, tickers: screener.exporting, profile, auth }))
        if (isAdded) { 
            const updated = [...addedTo]
            updated.push(p.name)
            setAddedTo(updated)
        }
    }

    const onGoToPortfolioClicked = (p) => {
        history.push(`/portfolio/?name=${p.name}`)
    }

    const renderPortfolios = () => {
        return profile.user.portfolios.map((p, index) => (
            <div key={index} className='p-1 w-100 limit-width mx-auto fl fl-justify-between fl-center-y border-bottom-light profile-item'>
                <span>{p.name}</span>
                <div>
                    {addedTo.indexOf(p.name) < 0 ? (
                        <button className='bs-btn btn-outline-primary mx-1' onClick={() => onAddToPortfolioClicked(p)}>Add to Portfolio</button>
                    ) : <button className='bs-btn btn-outline-primary mx-1' onClick={() => onGoToPortfolioClicked(p)}>Go to Portfolio</button>}
                    <IoChevronDownOutline className='icon' />
                </div>
            </div>
        ))
    }

    return (
        <Layout>
            <div className='bg-light text-center py-125'>Export to Portfolio</div>
            {!auth.token ? (
                <Alert>You are not signed in. If you leave this site, all your data will be <span className='fw-bold'>lost</span>. To save your portfolios, sign up <Link to='/sign-up' className='fw-bold'>here.</Link> It is completely free. Have an account? Sign in <Link to='/sign-in' className='fw-bold'>here</Link>.</Alert>
            ) : null
            }
            <div className='fl fl-col px-1'>
                <div className='p-1 w-100 limit-width mx-auto fl fl-justify-between fl-center-y'>
                    <span className='fw-bold'>My Portfolios</span>
                    <NewPortfolioBtn profile={profile} auth={auth} />
                </div>
                {renderPortfolios()}
            </div>
        </Layout>
    )
}

export default Export