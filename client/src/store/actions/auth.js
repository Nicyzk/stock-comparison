import { authActionTypes } from './actionTypes'
import axios from '../../helpers/axios'

const signUp = (payload) => {
    return async dispatch => {
        dispatch({
            type: authActionTypes.SIGNUP_REQUEST
        })
        try {
            const result = await axios.post('/auth/sign-up', payload)
            const { success } = result.data
            dispatch({
                type: authActionTypes.SIGNUP_SUCCESS,
                payload: {
                    success
                }
            })
            return true
        } catch (error) {
            dispatch({
                type: authActionTypes.SIGNUP_FAILURE,
                payload: { error }
            })
        }
    }
}

const login = (payload) => {
    return async dispatch => {
        dispatch({
            type: authActionTypes.LOGIN_REQUEST
        })
        try {
            const { email, password } = payload
            const result = await axios.post('/auth/login', { email, password })
            const { token, user } = result.data
            dispatch({ type: 'RESET' })
            dispatch({
                type: authActionTypes.LOGIN_SUCCESS, 
                payload: {
                    token, user
                }
            })
            return true
        } catch (error) {
            dispatch({
                type: authActionTypes.LOGIN_FAILURE,
                payload: { error }
            })
        }
    }
}

const logout = () => {
    return async dispatch => {
        dispatch({
            type: authActionTypes.LOGOUT_REQUEST
        })
        try {
            const result = await axios.post('/auth/logout')
            if (result.status === 200) {
                dispatch({ type: authActionTypes.LOGOUT_SUCCESS})
                dispatch({ type: 'RESET' })
            }
        } catch (error) {
            dispatch({
                type: authActionTypes.LOGOUT_FAILURE,
                payload: { error }
            })
        }
    }
}

export { signUp, login, logout } 