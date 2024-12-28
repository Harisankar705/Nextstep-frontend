import api from "../utils/api"
import { axiosError } from "../utils/AxiosError"

export const toggleFollow =async(followingId:string):Promise<any>=>{
    try {
        console.log('in sendfollowrequest',followingId)
        const response = await api.post('/followaccount', { followingId })
        console.log('respponse in togglefollower',response.data)
        return response.data

    } catch (error) {
        axiosError(error, 'sendFollowRequest')
                throw error
    }
   
}
export const followBack = async (connectionId:string):Promise<any>=>{
    try {
        console.log('in sendfollowrequest', connectionId)
        const response = await api.post('/followback', { connectionId })
        console.log('respponse in togglefollower',response.data)
        return response.data

    } catch (error) {
        axiosError(error, 'sendFollowRequest')
                throw error
    }
   
}
export const getPendingRequests=async()=>{
    try {
        const response = await api.get('/pendingrequests')
        console.log('GET PENDING REQUESTS',response)
        return response
    } catch (error) {
        axiosError(error,'getPendingrequests')
        throw error
    }
}
export const getConnections=async()=>{
    try {
        const response = await api.get('/connections')
        console.log('GET CONNECTIONS',response)
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
        console.log('commentpost',response)
        return response
    } catch (error) {
        axiosError(error, 'commentpost')
        throw error  
    }
}
export const getComments=async(postId:string)=>{
    try {
        const response=await api.get('/getComments',{params:{postId}})
        console.log('getcomments',response)
        return response.data
    } catch (error) {
        axiosError(error, 'commentpost')
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
        console.log('INTERACTION',response)
        const {likeCount,commentCount}=response.data.interactions
        return {likeCount,commentCount}
    } catch (error) {
        axiosError(error, 'interactioncount')
        throw error  
    }
}