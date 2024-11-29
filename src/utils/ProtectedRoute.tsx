import React from 'react'
import { Navigate } from 'react-router-dom'
interface ProctectedRouteProps{
    children:React.ReactNode
}
const ProtectedRoute :React.FC<ProctectedRouteProps>=({children}) => {
    console.log("IN PROTECTED ROUTE")
    const token=localStorage.getItem('accessToken')
    console.log('token',token)
    return token? children as JSX.Element:<Navigate to ='/login' replace/>
}

export default ProtectedRoute
