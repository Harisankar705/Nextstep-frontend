import { Building2, FileText, Calendar, Home, MessageSquare, LogOut, Rss, BookmarkCheck, Search, Hammer } from "lucide-react"
import { Logo } from "../../components/Logo"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearEmployer } from "../../redux/employerSlice"
import { persistor } from "../../redux/store"
import { useState } from "react"
import SearchUtil from "../../utils/Search/SearchUtil"
import { SearchResult } from "../../types/Candidate"
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
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    const [isSideBarOpen,setIsSideBarOpen]=useState(false)
    const handleSearchClick = () => {
        setIsSearchModalOpen(true)
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const handleLogout = () => {
        dispatch(clearEmployer())
        persistor.purge()
        navigate('/employerlogin')
    }
    const handleResultSelect = (result: SearchResult) => {
        switch (result.type) {
            case 'user':
                navigate(`/search-profile/${result._id}/user`);
                break;
            case 'company':
                navigate(`/search-profile/${result._id}/employer`);
                break;
        }
        setIsSearchModalOpen(false);
    };
    return (
        <div className="w-64 bg-[#1E2235] text-white h-screen fixed left-0 flex flex-col">
            <div className='p-4 flex items-center gap-2'>
                <Logo width={150} height={40} className="cursor-pointer" />
            </div>
            <button className="lg:hidden p-4 text-white" onClick={()=>setIsSideBarOpen(!isSideBarOpen)}>
                <Hammer size={24}/>
            </button>
            <nav className={`lg:flex-1 p-4 ${isSideBarOpen ? 'block':"hidden"}lg:block`}>
                <button onClick={handleSearchClick}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-2 text-gray-400 hover:bg-[#0AA594] hover:text-white`}>
                    <Search size={20} />
                    <span>Search</span>
                </button>
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
            {isSearchModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsSearchModalOpen(false)}>\
                    <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <SearchUtil onResultSelect={handleResultSelect} placeholder="Search on nextstep" className="w-full" />
                    </div>
                </div>
            )}
            <div className="p-4 border-t border-gray-700">
                <button
                    className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-gray-400 hover:bg-[#0AA594] hover:text-white transition-colors"
                    onClick={() => handleLogout()} >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}
export default SideBar
