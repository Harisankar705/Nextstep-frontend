import { Building2, FileText, Calendar, Home, MessageSquare, LogOut, Rss, BookmarkCheck } from "lucide-react"
import { Logo } from "../../components/Logo"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearEmployer } from "../../redux/employerSlice"
import { persistor } from "../../redux/store"

const navItems = [
    { name: "Dashboard", href: '/employerhome', icon: Home, badge: 0 },
    { name: "Messages", href: '#', icon: MessageSquare },
    { name: "Feed", href: '/feeds', icon: Rss },
    { name: "Company Profile", paths: ['/account', '/employer/edit-profile'], icon: Building2 },
    { name: "Job Listing", href: '/joblistings', icon: FileText },
    { name: "Saved", href: '/saved', icon: BookmarkCheck },
    { name: "My Schedule", href: '#', icon: Calendar }
]

const SideBar = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const location = useLocation()
    const handleLogout = () => {
        dispatch(clearEmployer())
        persistor.purge()
        navigate('/employerlogin')

    }

    return (
        <div className="w-64 bg-[#1E2235] text-white h-screen fixed left-0 flex flex-col">
            <div className='p-4 flex items-center gap-2'>
                <Logo width={150} height={40} className="cursor-pointer" />
            </div>
            <nav className='flex-1 p-4'>
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href || item.paths?.[0]}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-2 ${item.paths
                                ? item.paths.includes(location.pathname)
                                    ? 'bg-[#2D3247] text-white'
                                    : 'text-gray-400 hover:bg-[#0AA594] hover:text-white'
                                : location.pathname === item.href
                                    ? 'bg-[#2D3247] text-white'
                                    : 'text-gray-400 hover:bg-[#0AA594] hover:text-white'
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                        {item.badge && (
                            <span className='ml-auto bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                {item.badge}
                            </span>
                        )}
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button
                    className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-gray-400 hover:bg-[#0AA594] hover:text-white transition-colors"
               onClick={()=>handleLogout()} >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default SideBar
