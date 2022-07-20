import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../../store/actions/auth'
import Layout from '../../../components/Layout/Layout'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let history = useHistory()
    const dispatch = useDispatch()
    const formRef = useRef(null)

    const onLoginClicked = async (e) => {
        e.preventDefault()// Prevent init redux action to be called on form submit.
        if (formRef.current.reportValidity()) {
            const loggedIn = await dispatch(login({ email, password }))
            if (loggedIn) {
                history.replace('/profile')
                setEmail('')
                setPassword('')
            }
        }
    }

    return (
        <div className='bg-dark-purple min-vh-100'>
            <Layout>
                <div className='login-panel bg-white my-2 mx-auto px-1 pb-3 px-lg-2 border-light shadow br-5px'>
                    <h2 className='fs-3 p-1 my-2 text-dark-purple'>Log in to your account</h2>
                    <form ref={formRef}>
                        <div className='my-1'>
                            <label className='form-label fs-14px' htmlFor='login-email'>Email Address</label>
                            <input className='form-control' type='email' id='login-email' placeholder='Email address' value={email} onChange={e => setEmail(e.target.value)}></input>
                        </div>
                        <div className='my-1'>
                            <label className='form-label fs-14px' htmlFor='login-password'>Password</label>
                            <input className='form-control' id='login-password' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}></input>
                        </div>
                        <button className='btn btn-purple br-5px text-white w-100 my-1' onClick={onLoginClicked}>Login</button>
                    </form>
                    <div className='border-light my-1'></div>
                    <div className='fs-14px text-center'>Don't have an account? <Link to='/sign-up' className='fw-bold text-primary'>Sign up</Link></div>
                </div>
            </Layout>
        </div>
    )
}

export default Login