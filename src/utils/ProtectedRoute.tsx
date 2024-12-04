import React,{useEffect} from 'react'
import {useDispatch} from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'
interface ProtectedRouteProps
{
  children:React.ReactNode
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {user,isAuthenticated} = useSelector((state: any) =>state.user)
  console.log("IS AUTHENTICATED",isAuthenticated)
  useEffect(()=>{
    if(!isAuthenticated )
    {
      navigate('/login')
    }
  },[isAuthenticated,user,navigate])
  if(!isAuthenticated)
  {
    return <Spinner loading={true}/>
  }
  return <>{children}</>
  
  
}

export default ProtectedRoute