import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/candidate/Login.tsx';
import Signup from './pages/candidate/Signup';
import EmployerLogin from './pages/employer/EmployerLogin.tsx';
import EmployerSignup from './pages/employer/EmployerSignup.tsx';
import Home from './pages/candidate/Home.tsx'
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.tsx';
import CandidateDetails from './pages/candidate/CandidateDetails.tsx';
import Navbar from './utils/Navbar.tsx';
import ProtectedRoute from './utils/ProtectedRoute.tsx';
import AdminLogin from './pages/admin/AdminLogin.tsx';
import Employers from './pages/admin/Employers.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import Candidates from './pages/admin/Candidates.tsx';
import EmployerDashboard from './pages/employer/EmployerDashboard.tsx';
import Account from './pages/employer/Account.tsx';
import EmployerForm from './pages/employer/EmployerForm.tsx';
import { EmployerDetails,EditProfile } from './pages/employer/EmployerProfileForm.tsx';
import Profile from './pages/candidate/Profile.tsx';
import EditProfilee from './pages/candidate/EditProfilee.tsx'
import Verification from './pages/admin/Verification.tsx';
import { EditPost } from './pages/candidate/CreatePost/Editpost.tsx';
import UserProfile from './pages/candidate/UserProfile.tsx';
import { ConnectionRequest } from './pages/candidate/ConnectionRequest.tsx';
import { JobPostingForm } from './pages/employer/job/JobPostingForm.tsx';
import { JobListing } from './pages/employer/job/JobListing.tsx';
const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
        <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/navbar' element={<Navbar/>}/>
          <Route path='/home' element={<ProtectedRoute role='candidate'>{<Home />}</ProtectedRoute>} />
          <Route path='/candidate-details' element={<ProtectedRoute role='candidate'>{<CandidateDetails />}</ProtectedRoute>} />
            <Route path='/candidate-profile' element={<ProtectedRoute role='candidate'>{<Profile />}</ProtectedRoute>} />
          <Route path='/candidate-profile/:id' element={<ProtectedRoute role='candidate'>{<UserProfile />}</ProtectedRoute>} />
          <Route path='/edit-profile' element={<ProtectedRoute role='candidate'>{<EditProfilee />}</ProtectedRoute>}/>
          
          <Route path='/admin' element={<AdminLogin/>}/>
          <Route path='/sidebar' element={<Employers/>}/>
          <Route path='admindashboard'element={<Dashboard/>}/>
          <Route path='/candidates'element={<Candidates/>}/>
          <Route path='/employers' element={<Employers/>}/>
          <Route path='/verifyemployer/:id' element={<Verification />}/>
          <Route path='/followrequests' element={<ConnectionRequest />}/>

          <Route path='/employersignup' element={<EmployerSignup />} />
          <Route path='/employerlogin' element={<EmployerLogin />} />
          <Route path='/employerhome' element={<ProtectedRoute role='employer'><EmployerDashboard /></ProtectedRoute> }/>
          <Route path='/account' element={<ProtectedRoute role='employer'><Account /></ProtectedRoute>}/>
          <Route path='/addjob' element={<ProtectedRoute role='employer'><JobPostingForm /></ProtectedRoute>}/>
          <Route path='/editjob/:jobId' element={<ProtectedRoute role='employer'><JobPostingForm /></ProtectedRoute>} />

          <Route path='/joblistings' element={<ProtectedRoute role='employer'><JobListing /></ProtectedRoute>}/>
          <Route path='/employerdetails' element={<ProtectedRoute role='employer'>{<EmployerDetails />}</ProtectedRoute>}/>
          <Route path='/employer/edit-profile' element={<ProtectedRoute role='employer'>{<EditProfile />}</ProtectedRoute>}/>

        </Routes>

      </Router>
    </div>
  );
}

export default App;
