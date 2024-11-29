import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/candidate/Login.tsx';
import Signup from './pages/candidate/Signup';
import EmployerLogin from './pages/employer/EmployerLogin.tsx';
import EmployerSignup from './pages/employer/EmployerSignup.tsx';
import './utils/toast.css';
import Home from './pages/candidate/Home.tsx'
import ProtectedRoute from './utils/ProtectedRoute.tsx';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.tsx';
import CandidateDetails from './pages/candidate/CandidateDetails.tsx';
import Navbar from './utils/Navbar.tsx';
const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/employerlogin' element={<EmployerLogin />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/employersignup' element={<EmployerSignup />} />
          <Route path='/navbar' element={<Navbar/>}/>
          <Route path='/home' element={<Home/>}/> 
          <Route path='/home' element={<ProtectedRoute>{<Home />}</ProtectedRoute>} />
          <Route path='/candidate-details' element={<ProtectedRoute>{<CandidateDetails />}</ProtectedRoute>} />

        </Routes>

      </Router>
    </div>
  );
}

export default App;
