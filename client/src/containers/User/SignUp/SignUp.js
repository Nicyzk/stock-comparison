import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signUp } from '../../../store/actions/auth'
import Layout from '../../../components/Layout/Layout'

/***********EXACT IMITATION OF LOGIN PAGE. EDIT LATER *****************/

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const formRef = useRef(null)

    const onSignUpClicked = async (e) => {
        e.preventDefault() // Prevent init redux action to be called on form submit.
        if (formRef.current.reportValidity()) {
            const signedUp = await dispatch(signUp({ email, password }))
            if (signedUp) {
                setEmail('')
                setPassword('')
            }
        }
    }

    return (
        <div className='bg-dark-purple min-vh-100'>
            <Layout>
                <div className='login-panel bg-white my-2 mx-auto px-1 pb-3 px-lg-2 border-light shadow br-5px'>
                    <h2 className='fs-3 p-1 my-2 text-dark-purple'>Create a free account</h2>
                    <form ref={formRef}>
                        <div className='my-1'>
                            <label className='form-label fs-14px' htmlFor='sign-up-email'>Email Address</label>
                            <input className='form-control' type='email' id='sign-up-email' placeholder='Email address' value={email} onChange={e => setEmail(e.target.value)}></input>
                        </div>
                        <div className='my-1'>
                            <label className='form-label fs-14px'>Password</label>
                            <input className='form-control' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}></input>
                        </div>
                        <button className='btn btn-purple br-5px text-white w-100 my-1' onClick={onSignUpClicked}>Sign Up</button>
                    </form>
                    <div className='border-light my-1'></div>
                    <div className='fs-14px text-center'>Already have an account? <Link to='/login' className='fw-bold text-primary'>Login</Link></div>
                </div>
            </Layout>
        </div>
    )
}

export default SignUp