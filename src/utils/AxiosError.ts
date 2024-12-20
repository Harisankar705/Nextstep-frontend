import axios from "axios"

export const axiosError=(error:unknown,functionName:string)=>{
    if(axios.isAxiosError(error))
    {
        const errorMessage=error.response?.data?.message||error.message
        console.log(errorMessage)
        return errorMessage
    }
    else
    {
        return String(error)
    }
}
