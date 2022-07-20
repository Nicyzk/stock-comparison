import { combineReducers } from 'redux'
import authReducer from './reducers/auth'
import statusReducer from './reducers/status'
import portfolioReducer from './reducers/portfolio'
import profileReducer from './reducers/profile'
import screenerReducer from './reducers/screener'

const appReducer = combineReducers({
    auth: authReducer,
    status: statusReducer,
    portfolio: portfolioReducer, // currently selected portfolio
    profile: profileReducer,
    screener: screenerReducer
})

const rootReducer = (state, action) => {
    // Old state usually passed whenever there is an action. Setting undefined, resets state in all subreducers to default.
    if (action.type === 'RESET') {
        return appReducer(undefined, action)  
    }

    return appReducer(state, action)
}

export default rootReducer