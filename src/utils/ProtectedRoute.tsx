import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { RootState } from '../types/Candidate';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'candidate' | 'employer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const navigate = useNavigate();
  
  const candidateState = useSelector((state: RootState) => state.user);
  const employerState = useSelector((state: RootState) => state.employer);
  const adminState = useSelector((state: RootState) => state.admin);

  const isAuthenticated = role === 'candidate' 
    ? candidateState.isAuthenticated 
    : role === 'employer' 
    ? employerState.isAuthenticated 
    : role === 'admin' 
    ? adminState.isAuthenticated 
    : false;

 
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     const redirectPath = role === 'employer' ? '/employerlogin' : role === 'admin' ? '/admin' : '/login';
  //     navigate(redirectPath);
  //   }
  // }, [isAuthenticated, role, navigate]);

  // if (!isAuthenticated) {
  //   return <Spinner loading={true} />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
