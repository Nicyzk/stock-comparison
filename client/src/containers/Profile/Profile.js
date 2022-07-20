import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Alert from '../../components/UI/Alert/Alert'
import NewPortfolioBtn from './NewPortfolioBtn/NewPortfolioBtn'
import DeletePortfolio from './DeletePortfolio/DeletePortfolio'
import { getUserPortfolios } from '../../store/actions/profile'
import { IoChevronDownOutline } from 'react-icons/io5'
import './Profile.css'

const Profile = () => {
    const profile = useSelector(state => state.profile)
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if (auth.token) {
            dispatch(getUserPortfolios())
        }
    }, [])

    const onGoToPortfolioClicked = (p) => {
        history.push(`/portfolio/?name=${p.name}`)
    }

    const renderPortfolios = () => {
        return profile.user.portfolios.map((p, index) => (
            <div key={index} className='p-1 w-100 limit-width mx-auto fl fl-justify-between fl-center-y border-bottom-light profile-item'>
                <span>{p.name}</span>
                <div>
                    <button className='bs-btn btn-outline-primary mx-1' onClick={() => onGoToPortfolioClicked(p)}>Go to Portfolio</button>
                    <div className='d-inline-block mx-1'><DeletePortfolio portfolio={p}/></div>
                    <IoChevronDownOutline className='icon' />
                </div>
            </div>
        ))
    }

    return (
        <Layout>
            <div className='bg-light text-center py-125'>My Profile</div>
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

export default Profile