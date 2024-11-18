export const setSuthTokens=(token:string,refreshToken:string):void=>{
    localStorage.setItem('token',token)
    localStorage.setItem('refreshToken',refreshToken)
}
export const  getAuthTokens=():{token:string|null,refreshToken:string|null}=>{
    const token=localStorage.getItem('token')
    const refreshToken=localStorage.getItem('refreshToken')
    return {token,refreshToken}
}
export const clearTokens=():void=>{
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken') 
}