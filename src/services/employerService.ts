import { AxiosResponse } from "axios"
import api from "../utils/api"
import { axiosError } from "../utils/AxiosError"
import { JobType } from "../types/Candidate"
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
export const postjob=async(formData:any)=>{
    try {
        const response=await api.post('/createjob',{formData})
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'postjob')
        throw errorDetails 
    }
}
export const fetchJobs=async()=>{
    try {
        const response=await api.get('/getjobs')
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'fetchJobs')
        throw errorDetails 
    }
}
export const fetchUserJobs = async (params?: Record<string, any>): Promise<JobType[]> => {
    try {
        const response:AxiosResponse<JobType[]>=await api.post('/fetch-jobs')
        return response.data;
    } catch (error) {
        const errorDetails = axiosError(error, 'fetchJobs')
        throw errorDetails 
    }
}
export const isVerified=async()=>{
    try {
        const response=await api.get('/isverified')
        return response
    } catch (error) {
        const errorDetails=axiosError(error,'isVerified')
        throw errorDetails
    }
}
export const applyJob=async(jobId:string)=>{
    try {
        const response=await api.post('/apply-job',{jobId})
        return response
    } catch (error) {
        const errorDetails=axiosError(error,'applyjob')
        throw errorDetails
    }
}
export const fetchJobById=async(jobId:string|undefined)=>{
    try {
        const response=await api.get(`/getjob/${jobId}`)
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'fetch job by id')
        throw errorDetails 
    }
}
export const updateJob=async(jobId:string,formData:any)=>{
    try {
        const response=await api.put(`/updatejob/${jobId}`,formData)
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'fetch job by id')
        throw errorDetails 
    }
}
export const deleteJob=async(jobId:string,)=>{
    try {
        const response=await api.delete(`/deletejob/${jobId}`)
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'delete job')
        throw errorDetails 
    }
}
export const fetchApplicantsForJob=async(jobId:string)=>{
    try {
        const response=await api.get(`/get-applicants/${jobId}?`)
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'delete job')
        throw errorDetails 
    }
}
export const changeApplicationStatus = async (newStatus: string, userId: string) => {
    try {
        const requestBody = {
            status: newStatus,
            userId: userId
        };
        const response = await api.post(`/change-applicationstatus`, requestBody);
        return response.data; 
    } catch (error) {
        const errorDetails = axiosError(error, 'changeApplicationStatus');
        throw errorDetails; 
    }
};