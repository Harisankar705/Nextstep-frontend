    import axios from 'axios'
    import { axiosError } from '../utils/AxiosError'
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
        token?: string
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
    type role = "user" | "employer"
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
    export const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password })
            return response.data
        } catch (error: unknown) {
            axiosError(error, 'login')
            throw error

        }

    }
    export const checkEmailOrPhone = async (email: string, phoneNumber: string) => {
        try {
            const response = await api.post('/check-email-phone', { email, phoneNumber })
            console.log("response",response.data)
            return response.data.isTaken
        }
        catch (error) {
            console.error('Error checking phone/mail', error)
            axiosError(error, 'checkEmailorPhone')
            throw error

        }
    }
    export const refreshToken = async () => {
        try {
            const response = await api.post('/refresh-token', { refreshToken: localStorage.getItem('refreshToken') })
            return response.data
        } catch (error: unknown) {
            axiosError(error, 'refreshToken')
            throw error
        }
    }

    export const googleAuthentication=async(token:string,role:string):Promise<{success:boolean;token?:string;message?:string}>=>{
        try {
            console.log("IN GOOGLE",token)

                const response=await api.post('/googleauth',{tokenId:token,role})
                return response.data

            
        
        } catch (error) {
            axiosError(error,'googleAuthentication')
            throw error
        }
    }