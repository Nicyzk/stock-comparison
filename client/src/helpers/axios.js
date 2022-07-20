import axios from 'axios'
import store from '../store/store'
import { logout } from '../store/actions/auth'
import { APIPath } from './util'

const instance = axios.create({
    baseURL: APIPath()
})

instance.interceptors.request.use((config) => {
    const token = store.getState().auth.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    console.log(error)
    return Promise.reject(error)
})

instance.interceptors.response.use(res => res, error => {
    const { status } = error.response
    if (status === 400) {
        store.dispatch(logout())
    }
    // will this cause crashing. 
    return Promise.reject(error)
}) 

export default instance