import axios from "axios"

export const axiosError=(error:unknown,functionName:string)=>{
    if(axios.isAxiosError(error))
    {
        console.log(`${functionName}-axios error occured`,error.response?.data||error.message)
    }
    else
    {
        console.log(`${functionName}-unknown error occured`,error)
    }
}
