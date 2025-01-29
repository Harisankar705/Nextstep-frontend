import { InterviewScheduleData } from "../types/Employer"
import api from "../utils/api"
import { axiosError } from "../utils/AxiosError"

export const toggleFollow =async(followingId:string):Promise<any>=>{
    try {
        
        const response = await api.post('/followaccount', { followingId })
        
        return response.data

    } catch (error) {
        axiosError(error, 'sendFollowRequest')
                throw error
    }
   
}
export const followBack = async (connectionId:string):Promise<any>=>{
    try {
        
        const response = await api.post('/followback', { connectionId })
        
        return response.data

    } catch (error) {
        axiosError(error, 'sendFollowRequest')
                throw error
    }
   
}
export const getPendingRequests=async()=>{
    try {
        const response = await api.get('/pendingrequests')
        
        return response
    } catch (error) {
        axiosError(error,'getPendingrequests')
        throw error
    }
}
export const getConnections=async()=>{
    try {
        const response = await api.get('/connections')
        
        return response
    } catch (error) {
        axiosError(error,'getConnections')
        throw error
    }
}
export const checkFollowStatus=async(followingId:string):Promise<boolean>=>{
    try {
        const response=await api.get('/followstatus',{params:{followingId}})
        return response.data.isFollowing
    } catch (error) {
        axiosError(error, 'sendFollowRequest')
        throw error
    }
}
export const likePost=async(postId:string)=>{
    try {
        const response=await api.post('/likepost',{postId})
        return response
    } catch (error) {
        axiosError(error, 'likepost')
        throw error  
    }
}
export const commentPost = async (postId: string, comment:string)=>{
    try {
        const response = await api.post('/commentpost', { postId, comment })
        
        return response
    } catch (error) {
        axiosError(error, 'commentpost')
        throw error  
    }
}
export const getComments=async(postId:string)=>{
    try {
        const response=await api.get('/getComments',{params:{postId}})
        console.log('response',response)
        
        return response
    } catch (error) {
        axiosError(error, 'commentpost')
        throw error  
    }
}
export const stripePayment=async(amount:number)=>{
    try {
        const response=await api.post('/create-payment',{amount})
        return response.data
    } catch (error) {
        axiosError(error,'stripepayment')
        throw error
    }
}
export const changeToPremium=async(userId:string)=>{
    try {
        const respnse=await api.put('/changetopremium',{userId})
        return respnse
    } catch (error) {
        axiosError(error,'changeToPremium')
        throw error
    }
}
export const sharePost=async(postId:string)=>{
    try {
        const response=await api.post('/sharepost',{postId})
        return response
    } catch (error) {
        axiosError(error, 'commentpost')
        throw error  
    }
}
export const interactionCount=async(postId:string)=>{
    try {
        const response = await api.get('/getPostInteractions',{params:{postId}})
        
        const {likeCount,commentCount}=response.data.interactions
        return {likeCount,commentCount}
    } catch (error) {
        axiosError(error, 'interactioncount')
        throw error  
    }
}
export const savePost=async(postId:string)=>{
    try {
        const response=await api.post('/savepost',{postId})
        
        return response.data
    } catch (error) {
        axiosError(error,'savepost')
        throw error
    }
}
export const getSavedPost=async()=>{
    try {
        const response=await api.get('/getsavedposts')
        
        return response.data
    } catch (error) {
        axiosError(error,'getsavedpost')
        throw error
    }
}
export const checkSavedStatus=async(postId:string)=>{
    try {
        const response=await api.get(`/saved-posts/check/${postId}`)
        return response.data.isSaved
    } catch (error) {
        axiosError(error,'checkSavedstatus')
        throw error
    }
}
export const fetchJobs=async()=>{
    try {
        const response=await api.post('/fetch-jobs')
        return response
    } catch (error) {
        axiosError(error,'fetchjobs')
        throw error
    }
}
export const scheduleInterview=async(scheduleData:InterviewScheduleData,userId:string,jobId:string)=>{
    try {
        const response=await api.post('/schedule-interview',{userId,jobId,...scheduleData})
        return response
    } catch (error) {
        axiosError(error,'scheduleInterview')
        throw error
    }
}
export const getURL=async(url:string)=>{
    try {
        const response=await api.post('/fetchurl',{url})
        return response.data
    } catch (error) {
        axiosError(error,'getURL')
        throw error
    }
}
export const fetchUserMessages=async(id:string)=>{
    try {
        const response=await api.get(`/get-chat/${id}`)
        console.log(response)
        return response.data
    } catch (error) {
        axiosError(error,'fetchMessages')
        throw error
    }
}
export const sendMessage=async(messageData:any)=>{
    try {
        const response=await api.post(`/send-message/`,{messageData})
        return response.data
    } catch (error) {
        axiosError(error,'fetchMessages')
        throw error
    }
}
export const getNotifications=async()=>{
try {
    const response=await api.get('/notifications')
    return response.data
} catch (error) {
    axiosError(error,'getNotifications')
    throw error
}
}
export const getPostById=async(postId:string)=>{
    try {
        const response=await api.get('/get-post-byid',{params:postId})
        return response.data

    } catch (error) {
        axiosError(error,'getPostbyId')
        throw error
    }
}
export const markNotificationAsRead=async(notificationId:string)=>{
    try {
        const response=await api.post('/mark-as-read')
        return response
    } catch (error) {
        axiosError(error,'markNotificationAsRead')
        throw error
    }
}