import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';
import { RootState } from '../types/Candidate';
import { persistStore } from 'redux-persist';
import { store } from '../redux/store'; // Make sure to import your store correctly

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'candidate' | 'employer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const persistor = persistStore(store);
    
    // Wait until redux-persist has rehydrated the state
    persistor.persist();
    persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        console.log("Redux Persist State Rehydrated");
        setIsLoading(false); // State is loaded, stop showing spinner
      }
    });
  }, []);

  useEffect(() => {
    console.log("Role:", role);
    console.log("Candidate State:", candidateState);
    console.log("Employer State:", employerState);
    console.log("Admin State:", adminState);
    console.log("Is Authenticated:", isAuthenticated);
  }, [isAuthenticated, role]);

  if (isLoading) {
    return <Spinner loading={true} />;
  }

  // Don't redirect, just show the children
  return <>{children}</>;
};

export default ProtectedRoute;
