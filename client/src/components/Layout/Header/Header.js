import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import MenuIcon from './MenuIcon/MenuIcon'
import MenuSlider from './MenuSlider/MenuSlider'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/actions/auth'

const Header = () => {

    const [iconClicked, setIconClicked] = useState(false)
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const history = useHistory()

    const onLogoutClicked = () => {
        dispatch(logout())
        history.replace('/')
    }

    return (
        <>
            <nav className='navbar bg-white shadow p-1 fl fl-justify-between fl-center-y'>
                <a href='/' className='navbar-brand'>StocksRepo</a>

                <div className='navbar-nav-md'>
                    <a href="/" className='fl fl-center-y mx-1 text-hover-purple'>Home</a>
                    <a href="/screener" className='fl fl-center-y mx-1 text-hover-purple'>Screener</a>
                    <a href="/portfolio" className='fl fl-center-y mx-1 text-hover-purple'>Portfolio</a>
                    <a href="/blog" className='fl fl-center-y mx-1 text-hover-purple'>Blog</a>
                    {auth.token ? (
                        <p className='mx-1 text-hover-purple' role='button' onClick={onLogoutClicked}>Logout</p>
                    ) : (
                        <>
                            <a href="/login" className='fl fl-center-y mx-1 text-hover-purple'>Login</a>
                            <a href='/sign-up'>
                                <button type='button' className='btn btn-purple mx-1'>Sign Up</button>
                            </a>
                        </>
                    )}
                </div>
                <MenuIcon iconClicked={iconClicked} setIconClicked={setIconClicked} />

            </nav>
            <MenuSlider iconClicked={iconClicked} />
        </>
    )
}

export default Header