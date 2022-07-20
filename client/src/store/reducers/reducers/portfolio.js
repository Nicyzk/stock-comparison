import { portfolioActionTypes } from '../../actions/actionTypes'

const initialState = {
    name: '',
    tickers: [],
    data: {},
    loading: true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case portfolioActionTypes.SET_PORTFOLIO_REQUEST:
            return {
                ...state,
                loading: true
            }
        case portfolioActionTypes.SET_PORTFOLIO_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case portfolioActionTypes.SET_PORTFOLIO_FAILURE:
            return {
                ...state,
                loading: false
            }
        default: return state
    }
}

export default reducer