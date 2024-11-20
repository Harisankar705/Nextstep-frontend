import React from 'react'
import { Navigate } from 'react-router-dom'
const ProtectedRoute = ({children}:{children:React.ReactNode}) => {
    console.log("IN PROTECTED ROUTE")
    const token=localStorage.getItem('authtoken')
    console.log('token',token)
    return token?<>{children}</>:<Navigate to ='/login' replace/>
}

export default ProtectedRoute
