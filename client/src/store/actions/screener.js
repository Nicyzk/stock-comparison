import { screenerActionTypes } from './actionTypes'
import axios from '../../helpers/axios'

const getScreenerData = (payload) => {
    return async dispatch => {
        dispatch({
            type: screenerActionTypes.GET_SCREENED_DATA_REQUEST
        })
        try {
            let result
            result = await axios.post('/screener', payload)
            const { profile, total } = result.data
            Object.keys(profile).forEach(key => profile[key].ex_rate_exch = profile[key].ex_rate)

            const tickers = Object.keys(profile)
            const data = {}
            if (tickers.length > 0) {
                result = await axios.post('/portfolio/pl', { tickers })
                const { annualPnL } = result.data
                
                for (let t of tickers) {
                    data[t] = profile[t]
                    data[t].ex_rate_exch = data[t].ex_rate
                    data[t].pL = annualPnL[t]
                }
            }

            const { filters, page } = payload
            dispatch({
                type: screenerActionTypes.GET_SCREENED_DATA_SUCCESS,
                payload: { data, total, filters, page }
            })
        } catch (error) {
            dispatch({
                type: screenerActionTypes.GET_SCREENED_DATA_FAILURE,
                payload: {
                    error
                }
            })
        }
    }
}


const setExportingTickers = (payload) => {
    return {
        type: screenerActionTypes.SET_EXPORTING_TICKERS,
        payload
    }
}


export { getScreenerData, setExportingTickers }