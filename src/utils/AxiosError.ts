import axios from "axios"

export const axiosError=(error:unknown,functionName:string)=>{
    if(axios.isAxiosError(error))
    {
        const errorMessage=error.response?.data?.message||error.message
        return `Error in ${functionName}:${errorMessage}`
    }
    else
    {
        return String(error)
    }
}
