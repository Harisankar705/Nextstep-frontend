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
interface UserData{
    email:string
    password:string
    role:role,
    name:string
}
type role = "user" | "employer"
export const sendOTP = async (email: string, role: role): Promise<SendOTPResponse> => {
    try {
        console.log('in sendotp')
        const response = await api.post('/send-otp', { email, role })
        return response.data
    } catch (error:unknown) {
        axiosError(error,'sendOTP')
        throw error
    }
}
export const verifyOTP = async (email: string, otp: string, role: role): Promise<verifyOTPResponse> => {
    try {
        const response = await api.post('/verify-otp', { email, otp, role })
        return response.data

    } catch (error:unknown) {
        axiosError(error,'verifyOTP')
        throw error

    }

}
export const register = async (userData:UserData, otp:string) => {
    try {
        const response = await api.post('/signup', { userData, otp })
        return response.data
    } catch (error:unknown) {
        axiosError(error,'register')
        throw error
    }
}
export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password })
        return response.data
    } catch (error:unknown) {
        axiosError(error,'login')
        throw error

    }

}
export const refreshToken = async () => {
    try {
        const response = await api.post('/refresh-token', { refreshToken: localStorage.getItem('refreshToken') })
        return response.data
    }catch (error:unknown) {
        axiosError(error,'refreshToken')
        throw error
    }
}
