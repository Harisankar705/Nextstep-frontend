import axios from 'axios'
import { axiosError } from '../utils/AxiosError'
import { isTokenExpired } from '../utils/AuthUtils'
const api = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json"
    }
})
interface SendOTPResponse {
    message: string
    success: boolean
}
interface verifyOTPResponse { 
    success: boolean
    message: string
}
interface UserData {
    firstName: string
    secondName: string
    email: string
    password: string
    role: role,
    name: string
}
interface GoogleAuthResponse {
    success: string
    token?: string
    message?: string
}
type role = "user" | "employer"
let isRefreshing=false
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
            const tokenExpired = isTokenExpired(accessToken);
            
            if (tokenExpired) {
                console.log('Token expired');

                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const newAccessToken = await refreshToken();
                        if (newAccessToken) {
                            localStorage.setItem('accessToken', newAccessToken);
                            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        } else {
                            console.error('Failed to refresh token. Please log in again.');
                        }
                    } catch (error) {
                        console.error('Error while refreshing token:', error);
                    } finally {
                        isRefreshing = false;
                    }
                }
            } else {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const sendOTP = async (email: string, role: role): Promise<SendOTPResponse> => {
    try {
        console.log('in sendotp')
        const response = await api.post('/send-otp', { email, role })
        console.log("RESPONSEDATA", response.data)
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'sendOTP')
        throw error
    }
}
export const resendOTP = async (email: string, role: role): Promise<SendOTPResponse> => {
    try {
        console.log('in sendotp')

        const response = await api.post('/resend-otp', { email, role })
        console.log("RESPONSEDATA", response.data)
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'sendOTP')
        throw error
    }
}

export const verifyOTP = async (email: string, otp: string, role: role): Promise<verifyOTPResponse> => {
    try {

        const response = await api.post('/verify-otp', { email, otp, role })
        console.log('response', response.data)
        return response.data

    } catch (error: unknown) {
        axiosError(error, 'verifyOTP')
        throw error

    }

}
export const register = async (userData: UserData, otp: string) => {
    try {
        console.log('in register')

        const response = await api.post('/signup', { userData, otp })
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'register')
        throw error
    }
}
export const candidateDetails=async(details:Record<string,any>):Promise<any>=>{
    try
    {
        console.log("In candidatedetails")
        console.log(details)
        const response=await api.post('/candidate-details',details,{
            headers:{
                'Content-Type':"multipart/form-data"
            }
        })
        return response.data
    
    }catch(error:unknown)
    {
        axiosError(error,'candidateDetails')
        throw error
    }
}

export const login = async (email: string, password: string, role: role) => {
    try {

        const response = await api.post('/login', { email, password ,role})
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'login')
        throw error

    }

}
export const checkEmailOrPhone = async (email: string, phoneNumber: string, role: role,name:string) => {
    try {
        const response = await api.post('/check-email-phone', { email, phoneNumber,role,name })
        if(response.data.isEmailTaken)
        {
            return "Email already exists"
        }
        if(response.data.isPhoneTaken)
        {
            return "Phone number already taken"
        }
        if(response.data.isNameTaken)
        {
            return "Name is already taken"
        }
        return false
    }
    catch (error) {
        console.error('Error checking phone/mail', error)
        axiosError(error, 'checkEmailorPhone')
        throw error

    }
}
export const refreshToken = async () => {
    try {
        const response = await api.post('/refresh-token', {}, {
            withCredentials: true
        })
        const newAccessToken = response.data.accessToken
        return newAccessToken
    } catch (error: unknown) {
        axiosError(error, 'refreshToken')
        throw error
    }
}

export const googleAuthentication = async (token: string, role: string): Promise<GoogleAuthResponse> => {
    try {
        console.log("IN GOOGLE", token)

        const response = await api.post('/googleauth', { tokenId: token, role })
        return response.data



    } catch (error) {
        axiosError(error, 'googleAuthentication')
        throw error
    }
}
