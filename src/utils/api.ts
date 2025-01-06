import axios from 'axios'
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { persistor } from '../redux/store';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('error',error)
        // Handle inactive status or force logout
        if (error.response?.data?.message==="Token not found"||"Authentication restricted") {
            try {
                handleLogout()
            } catch (logoutError) {
                console.error('Logout error', logoutError);
            } finally {
                // Redirect to login page
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // Handle token refresh for 401 errors
        const originalRequest = error.config;
        console.log('originalrequest',originalRequest)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/refreshtoken', {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                handleLogout()
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api

// Logout utility function
export const handleLogout = async () => {
    try {
        console.log('in handlelogut')
        const dispatch=useDispatch()
        const navigate=useNavigate()
        const logout=()=>{
            dispatch(clearUser())
               persistor.purge()
               navigate('/login')
                }
                return logout
       
    } catch (error) {
        console.error('Logout error', error);
    } finally {
        // Redirect to login page
        window.location.href = '/login';
    }
}