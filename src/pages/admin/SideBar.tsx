import { Building2, CheckSquare, LogOut, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Logo } from "../../components/Logo"

const SideBar = () => {
  return (
    <div className='w-64 bg-white border-r border-gray-200 h-screen p-4 fixed hidden md:block'>
          <div className="flex items-center justify-center mb-8 bg-gray-300 p-4 rounded-lg">
            <Logo/>
        </div>
    
    <nav className="space-y-2">
      
        <Link to='/candidates' className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        <Users className="h-5 w-5"/>
        <span>Candidates</span>
        </Link>
        <Link to='/employers' className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        <Building2 className="h-5 w-5"/>
        <span>Employers</span>
        </Link>
        <Link to='/approval' className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        <CheckSquare className="h-5 w-5"/>
        <span>Approval</span>
        </Link>
    </nav>
    <div className="absolute bottom-4">
        <button className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <LogOut className='h-5 w-5'/>
            <span>Logout</span>
        </button>
    </div>
      </div>
  )
}

export default SideBar