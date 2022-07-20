import { portfolioActionTypes } from './actionTypes'
import axios from '../../helpers/axios'

// Assume user portfolios already loaded if auth user. Or for guest, already exist. 
const setPortfolio = (payload) => {
    return async dispatch => {
        dispatch({
            type: portfolioActionTypes.SET_PORTFOLIO_REQUEST
        })
        try {
            const { name } = payload
            let userProfile = payload.profile
            let p = userProfile.user.portfolios.find(p => p.name === name)
            if (!p) throw new Error('Portfolio could not be found!')
            
            // Be very careful not to pass by reference!! This may cause redux slices to become dependent on each other. 
            let nameCopy = p.name
            let tickersCopy = [...p.tickers]

            let result = await axios.post('/portfolio/profile', { tickers: tickersCopy })
            const { profile } = result.data

            result = await axios.post('/portfolio/pl', { tickers: tickersCopy })
            const { annualPnL } = result.data

            result = await axios.post('/portfolio/ratios', { tickers: tickersCopy })
            const { ratios } = result.data

            const data = {}
            for (let t of tickersCopy) {
                data[t] = profile[t]
                data[t].ex_rate_exch = data[t].ex_rate
                data[t].pL = annualPnL[t] // Exchange rate not required. 
                data[t].ratios = ratios[t]
            }

            dispatch({
                type: portfolioActionTypes.SET_PORTFOLIO_SUCCESS,
                payload: { name: nameCopy, tickers: tickersCopy, data }
            })

            return true
        } catch (error) {
            dispatch({
                type: portfolioActionTypes.SET_PORTFOLIO_FAILURE,
                payload: { error }
            })
        }
    }
}


export { setPortfolio }