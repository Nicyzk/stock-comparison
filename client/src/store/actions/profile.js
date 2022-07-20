import { profileActionTypes } from './actionTypes'
import axios from '../../helpers/axios'

const createNewPortfolio = (payload) => {
    return async dispatch => {
        dispatch({
            type: profileActionTypes.CREATE_NEW_PORTFOLIO_REQUEST
        })
        try {
            const { name, profile, auth } = payload
            if (name === '') throw new Error('Name cannot be empty!')
            if (auth.token) {
                // Authenticated user, create empty portfolio in DB. 
                await axios.post('/user-profile/portfolio/new', { name })
                dispatch({ type: profileActionTypes.CREATE_NEW_PORTFOLIO_SUCCESS, payload: {} })
                dispatch(getUserPortfolios())
            } else {
                // Guest
                if (profile.user.portfolios.findIndex(p => p.name === name) >= 0) throw new Error('Portfolio name already exists!')
                const updated = [...profile.user.portfolios]
                updated.push({ name, tickers: [] })
                dispatch({
                    type: profileActionTypes.CREATE_NEW_PORTFOLIO_SUCCESS,
                    payload: {
                        user: { portfolios: updated, templates: [...profile.user.templates] }
                    }
                })
            }
        } catch (error) {
            dispatch({
                type: profileActionTypes.CREATE_NEW_PORTFOLIO_FAILURE,
                payload: { error }
            })
        }
    }
}

const getUserPortfolios = () => {
    return async dispatch => {
        dispatch({
            type: profileActionTypes.GET_USER_PORTFOLIOS_REQUEST
        })
        try {
            // Authenticated user ONLY. 
            let result
            result = await axios.post('user-profile/get-portfolios')
            const { portfolios } = result.data
            dispatch({
                type: profileActionTypes.GET_USER_PORTFOLIOS_SUCCESS,
                payload: { portfolios }
            })
        } catch (error) {
            dispatch({
                type: profileActionTypes.GET_USER_PORTFOLIOS_FAILURE,
                payload: { error }
            })
        }
    }
}

const addToPortfolio = (payload) => {
    return async dispatch => {
        dispatch({
            type: profileActionTypes.ADD_TO_PORTFOLIO_REQUEST
        })
        try {
            const { name, tickers, profile, auth } = payload
            if (auth.token) {
                // Authenticated user 
                await axios.post('user-profile/portfolio/add-tickers', { name, tickers })
                dispatch( { type: profileActionTypes.ADD_TO_PORTFOLIO_SUCCESS, payload: {} } ) 
                dispatch(getUserPortfolios())
            } else {
                // Guest
                let copy = []
                profile.user.portfolios.forEach(p => copy.push({name: p.name, tickers: [...p.tickers]}))
                let portfolioCopy = copy.find(p => p.name === name)
                if (!portfolioCopy) throw new Error('User does not have portfolio specified. Are you trying to edit a default portfolio?')
                tickers.forEach(t => {
                    if (portfolioCopy.tickers.indexOf(t) >= 0) {
                        throw new Error('Ticker already exists in portfolio.')
                    } else { 
                        portfolioCopy.tickers.push(t)
                    }
                })
                dispatch({
                    type: profileActionTypes.ADD_TO_PORTFOLIO_SUCCESS,
                    payload: {
                        user: {
                            portfolios: copy,
                            templates: [...profile.user.templates]
                        }
                    }
                })
            }
            return true

        } catch (error) {
            dispatch({
                type: profileActionTypes.ADD_TO_PORTFOLIO_FAILURE,
                payload: { error }
            })
        }
    }
}

const removeFromPortfolio = (payload) => {
    return async dispatch => {
        dispatch({
            type: profileActionTypes.REMOVE_FROM_PORTFOLIO_REQUEST
        })
        try {
            const { name, tickers, profile, auth } = payload
            if (auth.token) {
                // Authenticated user
                await axios.post('user-profile/portfolio/remove-tickers', { name, tickers })
                dispatch({ type: profileActionTypes.REMOVE_FROM_PORTFOLIO_SUCCESS, payload: {} })
                dispatch(getUserPortfolios())
            } else {
                // Guest
                let copy = []
                profile.user.portfolios.forEach(p => copy.push({name: p.name, tickers: [...p.tickers]}))
                let portfolioCopy = copy.find(p => p.name === name)
                if (!portfolioCopy) throw new Error('User does not have portfolio specified. Are you trying to edit a default portfolio?')
                tickers.forEach(t => {
                    let index = portfolioCopy.tickers.indexOf(t)
                    portfolioCopy.tickers.splice(index, 1)
                })
                
                dispatch({
                    type: profileActionTypes.REMOVE_FROM_PORTFOLIO_SUCCESS,
                    payload: {
                        user: {
                            portfolios: copy,
                            templates: [...profile.user.templates]
                        }
                    }
                })
            }

        } catch (error) {
            dispatch({
                type: profileActionTypes.REMOVE_FROM_PORTFOLIO_FAILURE,
                payload: { error }
            })
        }
    }
}

const deletePortfolio = (payload) => {
    return async (dispatch, getState) => {
        dispatch({
            type: profileActionTypes.DELETE_PORTFOLIO_REQUEST
        })
        try {
            const { name, profile, auth } = payload
            if (auth.token) {
                // Authenticated user
                await axios.post('user-profile/portfolio/delete', { name })
                dispatch({ type: profileActionTypes.DELETE_PORTFOLIO_SUCCESS, payload: {} })
                dispatch(getUserPortfolios())
            } else {
                // Guest
                let updated = [...profile.user.portfolios]
                let index = updated.findIndex(p => p.name === name)
                if (index < 0) throw new Error('User does not have portfolio specified. Are you trying to delete a default portfolio?')
                updated.splice(index, 1)  
                dispatch({
                    type: profileActionTypes.DELETE_PORTFOLIO_SUCCESS,
                    payload: {
                        user: {
                            portfolios: updated,
                            templates: [...profile.user.templates]
                        }
                    }
                })
            }
            return getState()

        } catch (error) {
            dispatch({
                type: profileActionTypes.DELETE_PORTFOLIO_FAILURE,
                payload: { error }
            })
        }
    }
}



export { createNewPortfolio, getUserPortfolios, addToPortfolio, removeFromPortfolio, deletePortfolio }