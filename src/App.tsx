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
import { EmployerDetails,EditProfile } from './pages/employer/EmployerProfileForm.tsx';
import Profile from './pages/candidate/Profile.tsx';
import EditProfilee from './pages/candidate/EditProfilee.tsx'
import Verification from './pages/admin/Verification.tsx';
import UserProfile from './pages/candidate/UserProfile.tsx';
import { ConnectionRequest } from './pages/candidate/ConnectionRequest.tsx';
import { JobPostingForm } from './pages/employer/job/JobPostingForm.tsx';
import { JobListing } from './pages/employer/job/JobListing.tsx';
import { SavedPosts } from './pages/candidate/SavedPosts.tsx';
import Feed from './pages/employer/Feed.tsx';
import UserJobListing from './pages/candidate/UserJobListing.tsx';
import JobDetails from './pages/candidate/JobDetails.tsx';
import JobApplicants from './pages/employer/job/JobApplicants.tsx';
import Applicant from './pages/employer/job/Applicant.tsx';
import { Chat } from './pages/candidate/chat/Chat.tsx';
import SearchProfile from './pages/employer/SearchProfile.tsx';
const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          {/* user */}
        <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/navbar' element={<Navbar/>}/>
          <Route path='/home' element={<ProtectedRoute role='candidate'>{<Home />}</ProtectedRoute>} />
          <Route path='/jobs' element={<ProtectedRoute role='candidate'>{<UserJobListing />}</ProtectedRoute>} />
          <Route path='/job-details/:id' element={<ProtectedRoute role='candidate'>{<JobDetails />}</ProtectedRoute>} />
          <Route path='/candidate-details' element={<ProtectedRoute role='candidate'>{<CandidateDetails />}</ProtectedRoute>} />
            <Route path='/candidate-profile' element={<ProtectedRoute role='candidate'>{<Profile />}</ProtectedRoute>} />
          <Route path='/candidate-profile/:id/:role' element={<ProtectedRoute role='candidate'>{<UserProfile />}</ProtectedRoute>} />
          <Route path='/edit-profile' element={<ProtectedRoute role='candidate'>{<EditProfilee />}</ProtectedRoute>}/>
          <Route path='/saved' element={<ProtectedRoute role='candidate'>{<SavedPosts />}</ProtectedRoute>}/>
          
          {/* //admin */}
          <Route path='/admin' element={<AdminLogin/>}/>
          <Route path='/sidebar' element={<Employers/>}/>
          <Route path='admindashboard'element={<Dashboard/>}/>
          <Route path='/candidates'element={<Candidates/>}/>
          <Route path='/employers' element={<Employers/>}/>
          <Route path='/verifyemployer/:id' element={<Verification />}/>
          <Route path='/followrequests' element={<ConnectionRequest />}/>

          {/* employer */}
          <Route path='/employersignup' element={<EmployerSignup />} />
          <Route path='/search-profile/:id/:role' element={<SearchProfile/>} />
          <Route path='/messages/:userId/:role' element={<Chat />}/>

                    <Route path='/employerlogin' element={<EmployerLogin />} />
          <Route path='/employerhome' element={<ProtectedRoute role='employer'><EmployerDashboard /></ProtectedRoute> }/>
          <Route path='/feeds' element={<ProtectedRoute role='employer'><Feed /></ProtectedRoute> }/>
          <Route path='/account' element={<ProtectedRoute role='employer'><Account /></ProtectedRoute>}/>
          <Route path='/addjob' element={<ProtectedRoute role='employer'><JobPostingForm /></ProtectedRoute>}/>
          <Route path='/editjob/:jobId' element={<ProtectedRoute role='employer'><JobPostingForm /></ProtectedRoute>} />
          <Route path='/job-applicants/:jobId' element={<ProtectedRoute role='employer'><JobApplicants /></ProtectedRoute>} />
          <Route path='/applicant/:userId/:jobId' element={<ProtectedRoute role='employer'><Applicant /></ProtectedRoute>} />

          <Route path='/joblistings' element={<ProtectedRoute role='employer'><JobListing /></ProtectedRoute>}/>
          <Route path='/employerdetails' element={<ProtectedRoute role='employer'>{<EmployerDetails />}</ProtectedRoute>}/>
          <Route path='/employer/edit-profile' element={<ProtectedRoute role='employer'>{<EditProfile />}</ProtectedRoute>}/>

        </Routes>

      </Router>
    </div>
  );
}

export default App;
