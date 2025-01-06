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
export const postjob=async(formData:any)=>{
    try {
        const response=await api.post('/createjob',{formData})
        console.log('job response',response)
        return response.data
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
export const fetchJobById=async(jobId:string)=>{
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
        console.log('response',response)
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'fetch job by id')
        throw errorDetails 
    }
}
export const deleteJob=async(jobId:string,)=>{
    try {
        const response=await api.delete(`/deletejob/${jobId}`)
        console.log('response',response)
        return response
    } catch (error) {
        const errorDetails = axiosError(error, 'delete job')
        throw errorDetails 
    }
}
