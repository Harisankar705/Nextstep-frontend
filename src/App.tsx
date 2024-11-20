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
const App = () => {
  return (
    <div>
      <Toaster/>
      <Router>
        <Routes>
          
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/employerlogin' element={<EmployerLogin />} />
          <Route path='/employersignup' element={<EmployerSignup />} />
          <Route path='/home' element={<ProtectedRoute>{<Home/>}</ProtectedRoute>}/>

        </Routes>

      </Router>
    </div>
  );
}

export default App;
