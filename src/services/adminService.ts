import { Candidate, Employer } from "../types/Candidate";
import api from "../utils/api";
import { axiosError } from "../utils/AxiosError";

export const getUser = async <T extends Candidate | Employer>(role: 'user' | 'employer'): Promise<T[]> => {
    try {
        const response = await api.get(`/userdetails/${role}`);
        return response.data as T[];
    } catch (error) {
        axiosError(error, 'getCandidates');
        throw error;
    }
};
export const fetchReports=async()=>{
    try {
        const response=await api.get('/getreports')
        console.log(response.data)
        return response.data
    } catch (error) {
        axiosError(error,'fetchReports')
        throw error
    }
}
export const changeReportStatus=async(reportId:string,newStatus:string)=>{
    try {
        const response=await api.post('/change-report-status',{reportId,newStatus})
        return response.data
    } catch (error) {
        axiosError(error,'fetchReports')
        throw error
    }
}
export const adminLogout=async()=>{
    try {
        const response=await api.post('/adminlogout')
        return response
    } catch (error) {
        axiosError(error,'adminlogout')
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
        
        const response = await api.patch(`/verifyemployer/${id}`,{status})
        return response.data
    }
    catch(error)
    {
        axiosError(error,'verifyEmployer')
        throw error
    }
}
export const individualDetails = async (id: string|undefined,role:string)=>{
    try {
        const response = await api.get(`/individualdetails/${id}`,{params:{role}})
        
        return response.data

    } catch (error) {
        axiosError(error, 'individualDetails')
        throw error
    }
}
export const applicantDetails = async (id: string|undefined,jobId:string|undefined)=>{
    try {
        const response = await api.get(`/applicantDetails/${id}`,{params:{jobId}})
        
        return response.data

    } catch (error) {
        axiosError(error, 'applicantDetails')
        throw error
    }
}