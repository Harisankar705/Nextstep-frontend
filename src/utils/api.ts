import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { clearUser } from '../redux/userSlice';
import { persistor } from '../redux/store';
import {store} from '../redux/store'
import toast from 'react-hot-toast';

interface CustomAxiosRequestConfig extends AxiosRequestConfig
{
    _retry:boolean
}
interface ApiErrorResponse
{
    code?:string
    message?:string
}
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
    (response) => response,
    async (error:AxiosError) => {

        const originalRequest = error.config as CustomAxiosRequestConfig
        if(!originalRequest?.url||IGNORE_ERROR_URLS.some((url)=>originalRequest.url?.includes(url)))
        {
            return Promise.reject(error)
        }
       
        const shouldForceLogout = (
            error.response?.status === 401 ||
            LOGOUT_TRIGGER_CODES.includes((error.response?.data as ApiErrorResponse)?.code || "") ||
            ["Token not found", "Authentication restricted"].some(
                (msg) => ((error.response?.data as ApiErrorResponse)?.message || "").includes(msg)
            )
        );
        
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

export const handleLogout = async (error?:ApiErrorResponse) => {
    try {
        store.dispatch(clearUser())
        await persistor.purge()
        window.location.href='/location'
    } catch (error) {
        toast.error('Failed to handlelogout')
    } finally {
        window.location.href = '/login';
    }
}