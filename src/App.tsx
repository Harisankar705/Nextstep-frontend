import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './pages/candidate/Login.tsx'
import Signup from './pages/candidate/Signup.tsx'
import EmployerLogin from './pages/employer/EmployerLogin.tsx'
import EmployerSignup from './pages/employer/EmployerSignup.tsx'
import { UserProvider } from './pages/candidate/UserContext.tsx'
import Password from './pages/candidate/PassWord.tsx'
import OTPVerification from './pages/candidate/OtpVerification.tsx'
const App = () => {
  return (
    <div>
      <Router>
      <UserProvider>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/password' element={<Password/>}/>
          <Route path='/otp-verification' element={<OTPVerification/>}/>
          <Route path='/employerlogin' element={<EmployerLogin/>}/>
          <Route path='/employersignup' element={<EmployerSignup/>}/>
          </Routes>
          </UserProvider>
      </Router>
  
    </div>
  )
}

export default App
