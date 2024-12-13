import api from "../utils/api"
import { axiosError } from "../utils/AxiosError"

export const employerDetails = async (details: Record<string, any>,isEdit:boolean=false): Promise<any> => {
    try {
        const url=isEdit?'/employerDetails?isEdit=true':"/employerDetails"
        const response = await api.post(url, details, {
            headers: { "Content-Type": 'multipart/form-data' }
        })


        return response.data
    } catch (error) {
        const errorDetails = axiosError(error, 'login')
        throw errorDetails
    }
}