import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './pages/candidate/Login.tsx'
import Signup from './pages/candidate/Signup.tsx'
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          </Routes>
      </Router>
  
    </div>
  )
}

export default App
