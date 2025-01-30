import SideBar from "./SideBar"
import { AlertCircle, Plus } from "lucide-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { isVerified } from "../../services/employerService";
const EmployerDashboard = () => {
    const employer = useSelector((state:any) => state.employer);
    const navigate=useNavigate()
    const [verified,setVerified]=useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const handlePostJob=()=>{
            navigate('/addjob')
    }
    useEffect(()=>{
        const checkEmployerVerified=async()=>{
            try {
                setIsLoading(true)
                const response=await isVerified()
                if(response.data.message==='isVerified')
                {
                    setVerified(true)
                }
            } catch (error) {
                toast.error('Verification check failed')
                setVerified(false)
            }
            finally
            {
                setIsLoading(false)
            }
        }
        checkEmployerVerified()
    },[])
    const SkeltonCard: React.FC = () => {
        return (
            <div className='bg-[#2D3247] rounded-lg p-6 mb-4 animate-pulse'>
                <div className='h-4 bg-[#404663] rounded w-3/4 mb-4'></div>
                <div className='h-3 bg-[#404663] rounded w-1/2 mb-2'></div>
                <div className='h-3 bg-[#404663] rounded w-1/4'></div>
            </div>
        )
    }
    return (
        <div className='flex min-h-screen bg-[#1A1D2B] text-white'>
            <SideBar />
            <main className='flex-1 ml-64 p-8'>
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h2 className='text-2xl font-bold mb-1'>Good morning {employer.companyName}</h2>
                    </div>
                    <button className={`px-4 py-2 bg-[#6366F1] text-white rounded-lg flex items-center gap-2 ${verified 
                        ?'bg-[#6366F1] text-white':'bg-gray-500 text-gray-600 cursor-not-allowed'
                    }`} onClick={handlePostJob} disabled={!verified}>
                        <Plus size={20} />
                        Post a job
                    </button>
                </div>
                {!verified && !isLoading && (
                    <div className="bg-yellow-600 text-white p-4 rounded-lg mb-4 flex items-center">
                        <AlertCircle className="mr-2" />
                        <p>Your account is not verified. Please wait until the verification process is completed!</p>
                    </div>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <SkeltonCard key={item} />
                    ))}
                </div>
            </main>
        </div>
    )
}
export default EmployerDashboard