import { profileActionTypes } from '../../actions/actionTypes'

const initialState = {
    user: {
        portfolios: [{
            name: 'Default', tickers: ["Z74.SI", "S68.SI", "BUOU.SI", "A17U.SI", "C38U.SI", "G13.SI", "BN4.SI", "BS6.SI", "U14.SI", "U11.SI", "S63.SI", "C31.SI", "C07.SI", "C6L.SI", "H78.SI", "V03.SI", "T39.SI", "O39.SI"]
        }],
        templates: []
    },
    loading: true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case profileActionTypes.CREATE_NEW_PORTFOLIO_REQUEST:
            return {
                ...state,
                loading: true
            }
        case profileActionTypes.CREATE_NEW_PORTFOLIO_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case profileActionTypes.CREATE_NEW_PORTFOLIO_FAILURE:
            return {
                ...state,
                loading: false
            }
        case profileActionTypes.GET_USER_PORTFOLIOS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case profileActionTypes.GET_USER_PORTFOLIOS_SUCCESS:
            return {
                ...state,
                user: {
                    portfolios: action.payload.portfolios,
                    templates: [...state.user.templates]
                }
            }
        case profileActionTypes.GET_USER_PORTFOLIOS_FAILURE:
            return {
                ...state,
                loading: false
            }
        case profileActionTypes.ADD_TO_PORTFOLIO_REQUEST:
            return {
                ...state,
                loading: true
            }
        case profileActionTypes.ADD_TO_PORTFOLIO_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case profileActionTypes.ADD_TO_PORTFOLIO_FAILURE:
            return {
                ...state,
                loading: false
            }
        case profileActionTypes.REMOVE_FROM_PORTFOLIO_REQUEST:
            return {
                ...state,
                loading: true
            }
        case profileActionTypes.REMOVE_FROM_PORTFOLIO_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case profileActionTypes.REMOVE_FROM_PORTFOLIO_FAILURE:
            return {
                ...state,
                loading: false
            }
        case profileActionTypes.DELETE_PORTFOLIO_REQUEST:
            return {
                ...state,
                loading: true
            }
        case profileActionTypes.DELETE_PORTFOLIO_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case profileActionTypes.DELETE_PORTFOLIO_FAILURE:
            return {
                ...state,
                loading: false
            }
        default: return state
    }
}

export default reducer