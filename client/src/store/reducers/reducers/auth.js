import { authActionTypes } from '../../actions/actionTypes'

const initialState = {
    token: null,
    user: {
        email: ''
    },
    loading: false
}

const reducer = (state = initialState, action) => {
    console.log(action.type)
    switch (action.type) {
        case authActionTypes.SIGNUP_REQUEST:
            return {
                ...state,
                loading: true
            }
        case authActionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false
            }
        case authActionTypes.SIGNUP_FAILURE:
            return {
                ...state,
                loading: false
            }
        case authActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case authActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                token: action.payload.token,
                user: action.payload.user
            }
        case authActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false
            }
        case authActionTypes.LOGOUT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case authActionTypes.LOGOUT_SUCCESS:
            return {
                ...initialState
            }
        case authActionTypes.LOGOUT_FAILURE:
            return {
                ...state,
                loading: false
            }
        default: return state
    }
}

export default reducer