import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Briefcase, Calendar, Edit, Globe, Mail, MapPin, Users } from "lucide-react"
import SideBar from "./SideBar"
import Spinner from "../../utils/Spinner"

const Account = () => {
    const navigate = useNavigate()
    const employer = useSelector((state: any) => state.user)

    const handleEditProfile = () => {
        navigate('/employer/edit-profile')
    }

    if (!employer) {
        return <Spinner loading={true} />
    }

    const {
        companyName,
        location,
        description,
        website,
        dateFounded,
        email,
        industry,
        employees,logo
    } = employer
    const logoFileName = logo.includes('\\')
        ? logo.split('\\').pop()
        : logo;
    const logoURL = `http://localhost:4000/uploads/company-logo/${logoFileName}?t=${new Date().getTime()}`; 

    return (
        <div className='min-h-screen bg-[#0A0A0A] text-white'>
            <SideBar />
            <div className="container mx-auto px-4 py-12 ml-[300px]">
                <div className="flex justify-between items-center mb-12">
                    <h1 className='text-3xl font-bold'>Company Profile</h1>
                    <button
                        onClick={handleEditProfile}
                        className="bg-[#0DD3B4] hover:bg-[#0AA594] transition-colors duration-300 px-6 py-2 rounded-lg text-black flex items-center gap-2"
                    >
                        <Edit size={18} />
                        Edit Profile
                    </button>
                </div>

                <div className='bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl'>
                    <div className="h-56 bg-gradient-to-r from-[#0DD3B4] to-[#1A1A1A] relative">
                        <div className="absolute bottom-0 left-0 p-8 flex items-end">
                            <img
                                src={logoURL || '/placeholder-logo.png'}
                                alt='Company Logo'
                                className="w-40 h-40 rounded-xl border-4 border-[#1A1A1A] object-cover"
                            />
                            <div className="ml-8">
                                <h2 className="text-3xl font-bold">{companyName}</h2>
                                <p className="text-gray-300 flex items-center gap-2">
                                    <MapPin size={16} />
                                    {location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 bg-[#2A2A2A] rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-[#0DD3B4]">About Us</h3>
                                <p className="text-gray-300">{description}</p>
                            </div>

                            <div className="bg-[#2A2A2A] rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-[#0DD3B4]">Company Snapshot</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4">
                                        <Briefcase size={18} className="text-[#0DD3B4]" />
                                        <span className="text-gray-300">{industry} Industry</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Users size={18} className="text-[#0DD3B4]" />
                                        <span className="text-gray-300">{employees} Employees</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Calendar size={18} className="text-[#0DD3B4]" />
                                        <span className="text-gray-300">Founded {dateFounded}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div className="bg-[#2A2A2A] rounded-xl p-6 col-span-2">
                                <h3 className="text-xl font-semibold mb-4 text-[#0DD3B4]">Contact Information</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4">
                                        <Mail size={18} className="text-[#0DD3B4]" />
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-gray-300 hover:text-[#0DD3B4] transition-colors"
                                        >
                                            {email}
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Globe size={18} className="text-[#0DD3B4]" />
                                        <a
                                            href={website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-[#0DD3B4] transition-colors"
                                        >
                                            {website}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account