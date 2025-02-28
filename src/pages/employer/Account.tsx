import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Briefcase, Calendar, Edit, Globe, Mail, MapPin, Users } from "lucide-react";
import SideBar from "./SideBar";
import Spinner from "../../utils/Spinner";
import EmployerPosts from './EmployerPosts';
import { IEmployer } from "../../types/Employer";
const Account = () => {
    const navigate = useNavigate();
    const employer=useSelector((state:{user:IEmployer})=>state.user)
    const handleEditProfile = () => {
        navigate('/employer/edit-profile');
    };
    if (!employer) {
        return <Spinner loading={true} />;
    }
    const {
        companyName,
        location,
        description,
        website,
        dateFounded,
        email,
        industry,
        employees,
        logo
    } = employer;
    return (
        <div className=' min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row'>
            <div className="w-full lg:w-[250px] fixed lg:relative">
            <SideBar />
            </div>
         
            <div className=" flex-1 p-4  lg:p-12 lg:ml-[250px]">
                <div className="flex justify-between items-center mb-12">
                    <h1 className='text-2xl lg:text-3xl font-bold'>Company Profile</h1>
                    <button
                        onClick={handleEditProfile}
                        className="bg-[#0DD3B4] hover:bg-[#0AA594] transition-colors duration-300 px-4 lg:px-6 py-2 rounded-lg text-black flex items-center gap-2"
                    >
                        <Edit size={18} />
                        Edit Profile
                    </button>
                </div>
                <div className='bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl'>
                    <div className="h-56 bg-gradient-to-r from-[#0DD3B4] to-[#1A1A1A] relative">
                        <div className="absolute bottom-0 left-0 p-4 md:p-8  flex flex-col md:flex-row items-start md:items-end gap-4">
                            <img
                                src={logo}
                                alt='Company Logo'
                                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-xl border-4 border-[#1A1A1A] object-cover"
                            />
                            <div>
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{companyName}</h2>
                                <p className="text-gray-300 flex items-center gap-2 text:sm md:text-base">
                                    <MapPin size={16} />
                                    {location}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                            <div className="md:col-span-2 bg-[#2A2A2A] rounded-xl p-6">
                                <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#0DD3B4]">About Us</h3>
                                <p className="text-gray-300 text:sm md:text-base">{description}</p>
                            </div>
                            <div className="bg-[#2A2A2A] rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-[#0DD3B4]">Company Snapshot</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4">
                                        <Briefcase size={18} className="text-[#0DD3B4] shrink-0" />
                                        <span className="text-gray-300 text:sm md:text-base">{industry} Industry</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Users size={18} className="text-[#0DD3B4] shrink-0" />
                                        <span className="text-gray-300">{employees} Employees</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Calendar size={18} className="text-[#0DD3B4] shrink-0" />
                                        <span className="text-gray-300 text:sm md:text-base">Founded {dateFounded.toLocaleDateString()}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-8">
                            <div className="bg-[#2A2A2A] rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-[#0DD3B4]">Contact Information</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4">
                                        <Mail size={18} className="text-[#0DD3B4] shrink-0" />
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-gray-300 hover:text-[#0DD3B4] transition-colors break-all text-sm md:text-base"
                                        >
                                            {email}
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Globe size={18} className="text-[#0DD3B4] shrink-0" />
                                        <a
                                            href={website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-[#0DD3B4] transition-colors break-all text-sm md:text-base"
                                        >
                                            {website}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <EmployerPosts />
            </div>
        </div>
    );
};
export default Account;