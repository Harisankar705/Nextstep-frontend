import axios from 'axios'
const api=axios.create({
    
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})
api.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest=error.config
        if(error.response?.status===401 && !originalRequest._retry)
        {
            originalRequest._retry=true
            try {
                const response=await api.post('/refreshtoken',{},{withCredentials:true})
                return api(originalRequest)
            } catch (error) {
                window.location.href='/login'
                return Promise.reject(error)
            }
        }
    }
)
export default api
