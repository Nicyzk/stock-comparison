const initialState = {
    error: null,
    success: null
}

const reducer = (state = initialState, action) => {
    let error = null
    let success = null
    if (action.payload) {
        error = action.payload.error 
        success = action.payload.success
    }
    if (error) {
        return {
            error: action.payload.error
        }
    }
    if (success) {
        return {
            success: action.payload.success
        }
    }
    return initialState
}

export default reducer