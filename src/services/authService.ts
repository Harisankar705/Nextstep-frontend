import { axiosError } from '../utils/AxiosError'
import api from '../utils/api'
import {  SendOTPResponse, UserData, verifyOTPResponse } from '../types/Candidate'
 export type role = "user" | "employer"|"admin"
export const sendOTP = async (email: string, role: role): Promise<SendOTPResponse> => {
    try {
        const response = await api.post('/send-otp', { email, role }, { withCredentials: false })
        return response.data
    } catch (error: unknown) {
        axiosError(error, 'sendOTP')
        throw error
    }
}
export const getUserPosts=async(userId?:string)=>{
    try {
        const response = await api.get('/userposts',{params:{userId}})
        return response.data 
    } catch (error) {
        axiosError(error,'getUserPosts')
        throw error
    }
}
export const updatePost=async(postId:string,formData:FormData)=>{
    try {
        const response = await api.post(`/updatePost/${postId}`, formData,{
            headers:{
                'Content-Type': 'multipart/form-data', 
            }
        })
        return response
    } catch (error) {
        axiosError(error,'updatePost')
        throw error
    }
}
export const fetchUserPosts=async()=>{
    try {
        const response = await api.get('/getpost')
        return response.data 
    } catch (error) {
        axiosError(error,'getUserPosts')
        throw error
    }
}
export const createPost=async(formData:FormData)=>{
    try {
        const response = await api.post('/createpost', formData,{
            headers:{
                'Content-Type': 'multipart/form-data', 
            }
        })
        return response
    } catch (error) {
        axiosError(error,'createPost')
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
export const candidateDetails = async (details: any): Promise<any> => {
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
        if (response?.data) {
            return response.data
        }
    } catch (error: unknown) {
        axiosError(error, 'login')
        throw error
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
export const search=async(query:string)=>{
    try {
        const response = await api.post('/search', { query })
        return response  
    } catch (error) {
    axiosError(error,'search')        
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
// export const googleAuthentication = async (token: string, role: string): Promise<GoogleAuthResponse> => {
//     try {
//         const response = await api.post('/googleauth', { tokenId: token, role })
//         return response.data
//     } catch (error) {
//         axiosError(error, 'googleAuthentication')
//         throw error
//     }
// }
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
