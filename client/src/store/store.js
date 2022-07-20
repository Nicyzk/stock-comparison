import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import rootReducer from './reducers/reducer';
import { loadState, saveState } from './sessionStorage'

const persistedState = loadState()

const store = createStore(rootReducer, persistedState, composeWithDevTools(
    applyMiddleware(thunk)
));

store.subscribe(() => {
    saveState(store.getState())
})

export default store

// Note: You can persist only a portion of redux if you want. Just save the portion of state and in the 2nd arg, pass a copy of
// root reducer with a portion overwritten by the saved state. 