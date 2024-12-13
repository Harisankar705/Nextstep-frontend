import axios from 'axios'
import { axiosError } from '../utils/AxiosError'
import dotenv from 'dotenv';
import { isTokenExpired } from '../utils/AuthUtils'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const GOOGLE_CLIENT_ID = import.meta.env.VITE_AUTH_GOOGLE_ID



import api from '../utils/api'
import { Candidate } from '../types/Candidate';
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


type role = "user" | "employer"|"admin"


export const sendOTP = async (email: string, role: role): Promise<SendOTPResponse> => {
    try {
        const response = await api.post('/send-otp', { email, role }, { withCredentials: false })
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'sendOTP')
        throw error
    }
}
export const resendOTP = async (email: string, role: role): Promise<SendOTPResponse> => {
    try {

        const response = await api.post('/resend-otp', { email, role }, { withCredentials: false })
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'sendOTP')
        throw error
    }
}

export const verifyOTP = async (email: string, otp: string, role: role): Promise<verifyOTPResponse> => {
    try {

        const response = await api.post('/verify-otp', { email, otp, role }, { withCredentials: false })
        return response.data

    } catch (error: unknown) {
        axiosError(error, 'verifyOTP')
        throw error

    }

}
export const register = async (userData: UserData, otp: string) => {
    try {

        const response = await api.post('/signup', { userData, otp },{withCredentials:false})
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'register')
        throw error
    }
}
export const candidateDetails = async (details: Record<string, any>): Promise<any> => {
    try {
        const response = await api.post('/candidate-details', details, {
            headers: {
                'Content-Type': "multipart/form-data"
            },
           
        })
        return response.data

    } catch (error: unknown) {
        axiosError(error, 'candidateDetails')
        throw error
    }
}


export const login = async (email: string, password: string, role: role) => {
    try {
        const response = await api.post('/login', { email, password, role }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        const errorDetails=axiosError(error, 'login')
        throw errorDetails
        

    }

}

export const checkEmailOrPhone = async (email: string, phoneNumber: string, role: role, name: string) => {
    try {
        const response = await api.post('/check-email-phone', { email, phoneNumber, role, name }, { withCredentials: false })
        if (response.data.isEmailTaken) {
            return "Email already exists"
        }
        if (response.data.isPhoneTaken) {
            return "Phone number already taken"
        }
        if (response.data.isNameTaken) {
            return "Name is already taken"
        }
        return false
    }
    catch (error) {
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

        const response = await api.post('/googleauth', { tokenId: token, role })
        return response.data



    } catch (error) {
        axiosError(error, 'googleAuthentication')
        throw error
    }
}
// export const userAuthenticated = async (): Promise<boolean> => {
//     try {
//         const response = await api.get('/protected')
//         if (response.status === 200) {
//             return true
//         }
//         return false
//     } catch (error) {
//         axiosError(error, 'usetAuthenticated')
//         throw error
//     }
// }


export const getUser = async (role: 'user'|'employer'): Promise<Candidate[]> => {
    try {
        const response = await api.get(`/userdetails/${role}`);  
        return response.data
    } catch (error) {
        axiosError(error, 'getCandidates')
        throw error
    }
}
export const toogleStatus = async (id: string, role: string): Promise<Candidate[]> => {
    try {
        const response = await api.post(`/togglestatus/${id}`, { role })
        return response.data
    }
    catch (error) {
        axiosError(error, 'toogleStatus')
        throw error
    }
}