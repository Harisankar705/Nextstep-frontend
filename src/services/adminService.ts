import { Candidate } from "../types/Candidate";
import api from "../utils/api";
import { axiosError } from "../utils/AxiosError";

export const getUser = async (role: 'user' | 'employer'): Promise<Candidate[]> => {
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
export const verifyEmployer=async(id:string,status:"VERIFIED"|"DENIED")=>{
    try
    {
        console.log('in verifyemployer',status)
        const response = await api.patch(`/verifyemployer/${id}`,{status})
        return response.data
    }
    catch(error)
    {
        axiosError(error,'verifyEmployer')
        throw error
    }
}
export const individualDetails = async (id: string)=>{
    try {
        console.log('in individual details')
        const response = await api.get(`/individualdetails/${id}`,{})
        
        return response.data

    } catch (error) {
        axiosError(error, 'individualDetails')
        throw error
    }
}