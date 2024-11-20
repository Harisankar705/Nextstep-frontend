import { LogOut } from 'lucide-react'
import React from 'react'

const Home = () => {
    const logout=()=>{
        localStorage.removeItem('authtoken')
        window.location.href='/login'
    }
  return (
    <div>
      <h1 className='align'>Welcome</h1>
      <button  onClick={logout}>Logout</button>
    </div>
  )
}

export default Home
