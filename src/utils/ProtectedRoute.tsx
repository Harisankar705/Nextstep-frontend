import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'candidate' | 'employer' | 'admin';
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const navigate = useNavigate();
  const { user: candidate, isAuthenticated: isCandidateAuthenticated } = useSelector((state: any) => state.user);
  const { user: employer, isAuthenticated: isEmployerAuthenticated } = useSelector((state: any) => state.employer);
  const { user: admin, isAuthenticated: isAdminAuthenticated } = useSelector((state: any) => state.admin);
  // Determine authentication status based on role
  const isAuthenticated = role === 'candidate' 
    ? isCandidateAuthenticated 
    : role === 'employer' 
    ? isEmployerAuthenticated 
    : role === 'admin' 
    ? isAdminAuthenticated 
    : false;
  const user = role === 'candidate' 
    ? candidate 
    : role === 'employer' 
    ? employer 
    : role === 'admin' 
    ? admin 
    : null;
  useEffect(() => {
    if (!isAuthenticated) {
      if (role === 'candidate') {
        navigate('/login');
      } else if (role === 'employer') {
        navigate('/employerlogin');
      } else if (role === 'admin') {
        navigate('/admin'); 
      }
    }
  }, [isAuthenticated, role, navigate]);
  if (!isAuthenticated) {
    return <Spinner loading={true} />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;