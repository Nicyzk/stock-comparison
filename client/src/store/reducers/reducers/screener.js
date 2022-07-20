import { screenerActionTypes } from '../../actions/actionTypes'

const initialState = {
    data: {},
    filters: [],
    page: 1,
    total: null,
    exporting: [],
    loading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case screenerActionTypes.GET_SCREENED_DATA_REQUEST:
            return {
                ...state,
                loading: true
            }
        case screenerActionTypes.GET_SCREENED_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.data,
                filters: action.payload.filters,
                page: action.payload.page,
                total: action.payload.total
            }
        case screenerActionTypes.GET_SCREENED_DATA_FAILURE:
            return {
                ...state,
                loading: false
            }
        case screenerActionTypes.SET_EXPORTING_TICKERS:
            return {
                ...state,
                exporting: action.payload.exporting
            }
        default: return state
    }
}

export default reducer