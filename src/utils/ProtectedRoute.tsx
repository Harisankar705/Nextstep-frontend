import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  role?: 'candidate' | 'employer'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const navigate = useNavigate()

  const { user: candidate, isAuthenticated: isCandidateAuthenticated } = useSelector((state: any) => state.user)
  const { user: employer, isAuthenticated: isEmployerAuthenticated } = useSelector((state: any) => state.employer)

  const isAuthenticated = role === 'candidate' ? isCandidateAuthenticated : isEmployerAuthenticated
  const user = role === 'candidate' ? candidate : employer

  useEffect(() => {
    if (!isAuthenticated) {
      if (role === 'candidate') {
        navigate('/login1')
      } else if (role === 'employer') {
        navigate('/employerlogin')
      }
    }
  }, [isAuthenticated, role, navigate])

  if (!isAuthenticated) {
    return <Spinner loading={true} />
  }

  return <>{children}</>
}

export default ProtectedRoute
