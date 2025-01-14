import axios from 'axios'
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { persistor } from '../redux/store';
import {store} from '../redux/store'
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})
const LOGOUT_TRIGGER_CODES=[
    'TOKEN_EXPIRED',
    'UNAUTHORIZED',
    'TOKEN_NOT_FOUND',
    'AUTHENTICATION_REQUIRED'
]
const IGNORE_ERROR_URLS=[
    '/login',
    '/register',
    '/refresh-token'
]
api.interceptors.response.use(
    (response:string) => response,
    async (error:any) => {

        const originalRequest = error.config;
        if(IGNORE_ERROR_URLS.some(url=>originalRequest.url.includes(url)))
        {
            return Promise.reject(error)
        }
        const shouldForceLogout=(
            error.response?.status===401||LOGOUT_TRIGGER_CODES.includes(error.response?.data?.code)||
            ['Token not found','Authentication restricted'].some(message=>error.response?.data?.message?.includes(message))
        )
        if(shouldForceLogout)
        {
            return handleLogout(error)
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/refreshtoken', {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api

export const handleLogout = async (error?:any) => {
    try {
        store.dispatch(clearUser())
        await persistor.purge()
        window.location.href='/location'
    } catch (error) {
        console.error('Logout error', error);
    } finally {
        window.location.href = '/login';
    }
}