import { useEffect, useState } from 'react';
import { Home, Store, Users, Menu, Bell, User, BriefcaseBusiness, LogOut, LucideMessagesSquare, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { persistor } from '../redux/store';
import SearchUtil from './Search/SearchUtil';
import { Notification } from '../pages/candidate/Notification';
export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen,setMobileMenuOpen]=useState(false)
    const [isNotificationModalOpen,setisNotificationModalOpen]=useState(false)
    const dispatch = useDispatch();
    const handleBellClick=()=>{
        setisNotificationModalOpen(!isNotificationModalOpen)
    }
    const handleAccountClick = () => {
        navigate('/candidate-profile');
    };
    const toggleMobileMenu=()=>{
        setMobileMenuOpen(!mobileMenuOpen)
    }
    const handleConnectionClick = () => {
        navigate('/followrequests');
    };
    const handleLogout = () => {
        dispatch(clearUser());
        persistor.purge();
        navigate('/login');
    };
    const handleJobClick = () => {
        navigate('/jobs');
    };
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    const handleMessageClick=()=>{
        navigate('/messages')
    }
    const handleSearchResultSelect = (result: any) => {
        switch (result.type) {
            case 'user':
                navigate(`/candidate-profile/${result._id}/user`);
                break;
            case 'job':
                navigate(`/job/${result._id}`);
                break;
            case 'company':
                navigate(`/candidate-profile/${result._id}/employer`);
                break;
            default:
                break;
        }
    };
    return (
        <div className="w-full border-b border-gray-700 bg-black">
            <div className="hidden md:flex h-16 items-center px-4 gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <a href="/" className="text-purple-500">
                        <Logo width={160} height={80} />
                    </a>
                    <SearchUtil className="flex-1" onResultSelect={handleSearchResultSelect} />
                </div>
                <nav className="flex items-center gap-6 max-w-4xl flex-1 justify-center">
                    <button className="h-16 px-4 hover:bg-gray-900 text-purple-500">
                        <Home className="h-6 w-6" />
                    </button>
                    <button
                        className={`h-16 px-4 hover:bg-gray-900 ${location.pathname === '/jobs' ? 'bg-gray-900 text-purple-500' : 'text-gray-400'}`}
                        onClick={handleJobClick}
                    >
                        <BriefcaseBusiness className="h-6 w-6" />
                    </button>
                    <button className="h-16 px-4 hover:bg-gray-900 text-gray-400">
                        <Store className="h-6 w-6" />
                    </button>
                    <button className="h-16 px-4 hover:bg-gray-900 text-gray-400">
                        <Users className="h-6 w-6" onClick={handleConnectionClick} />
                    </button>
                </nav>
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <button className="p-2 rounded-full hover:bg-gray-900 text-gray-400">
                        <Menu className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-900 text-gray-400">
                        <LucideMessagesSquare className="h-5 w-5" onClick={handleMessageClick}/>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-900 text-gray-400" onClick={handleBellClick}>
                        <Bell className="h-5 w-5" />
                    </button>
                    {isNotificationModalOpen && (
                        <Notification isOpen={isNotificationModalOpen} onClose={() => setisNotificationModalOpen(false)} />
                    )}
                    <div className="relative">
                        <div 
                            className="h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen} 
                            aria-haspopup="true"
                        >
                            <User className="h-5 w-5" />
                        </div>
                        {dropdownOpen && (
                            <div id="profile-dropdown" className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                <div className="py-2">
                                    <button className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-200" onClick={handleLogout}>
                                        <LogOut className="h-5 w-5 mr-2" />Logout
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-200" onClick={handleAccountClick}>
                                        <User className="h-5 w-5 mr-2" />View Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='md:hidden'>
                <div className='flex h-16 items-center justify-between px-4'>
                    <a href='/' className='text-purple-500'>
                    <Logo width={120} height={60}/>
                    </a>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-full hover:bg-gray-900 text-gray-400' onClick={()=>setisNotificationModalOpen(true)}>
                            <Bell className='h-5 w-5'/>
                        </button>
                        <button className='p-2 rounded-full hover:bg-gray-900 text-gray-400' onClick={toggleMobileMenu}>
                            {mobileMenuOpen ? <X className='w-6 h-6'/>:<Menu className='w-6 h-6'/>}
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className='fixed inset-0 bg-black z-50 pt-16'>
                        <div className='px-4 py-4'>
                            <SearchUtil className='mb-4' onResultSelect={(result)=>{
                                handleSearchResultSelect(result)
                                toggleMobileMenu()
                            }}
                            />
                        </div>
                        <nav className='space-y-4 px-4'>
                            <button className='w-full text-left py-3 px-4 hover:bg-gray-900 text-white flex items-center gap-3'
                            onClick={()=>{
                                navigate('/')
                                toggleMobileMenu()
                            }}>
                                <Home className='h-6 w-6'/>Home
                            </button>
                            <button className='w-full text-left py-3 px-4 hover:bg-gray-900 text-white flex items-center gap-3'
                            onClick={()=>{
                                navigate('/jobs')
                                toggleMobileMenu()
                            }}>
                                <BriefcaseBusiness className='h-6 w-6'/>Home
                            </button>
                            <button className='w-full text-left py-3 px-4 hover:bg-gray-900 text-white flex items-center gap-3'
                            onClick={()=>{
                                navigate('/messages')
                                toggleMobileMenu()
                            }}>
                                <LucideMessagesSquare className='h-6 w-6'/>Home
                            </button>
                            <button className='w-full text-left py-3 px-4 hover:bg-gray-900 text-white flex items-center gap-3'
                            onClick={()=>{
                                navigate('/followrequests')
                                toggleMobileMenu()
                            }}>
                                <Users className='h-6 w-6'/>Home
                            </button>
                            <button className='w-full text-left py-3 px-4 hover:bg-gray-900 text-white flex items-center gap-3'
                            onClick={()=>{
                                navigate('/candidate-profile')
                                toggleMobileMenu()
                            }}>
                                <User className='h-6 w-6'/>Home
                            </button>
                            <button className='w-full text-left py-3 px-4 hover:bg-gray-900 text-white flex items-center gap-3'
                            onClick={()=>{
                                handleLogout()
                                toggleMobileMenu()
                            }}>
                                <LogOut className='h-6 w-6'/>Home
                            </button>
                        </nav>
                    </div>
                )}
            </div>
            {isNotificationModalOpen && (
                <Notification isOpen={isNotificationModalOpen}
                onClose={()=>setisNotificationModalOpen(false)}/>
            )}
        </div>
    );
}
