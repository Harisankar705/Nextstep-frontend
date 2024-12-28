import { useEffect, useState } from "react"
import { Employer } from "../../types/Candidate"
import { useParams } from "react-router-dom"
import { individualDetails, verifyEmployer } from "../../services/adminService"
import SideBar from "./SideBar"
import SearchBar from "./SearchBar"
import { Building2, Calendar, Globe, Mail, MapPin, Users } from 'lucide-react'
import api from "../../utils/api"
import Spinner from "../../utils/Spinner"
import { toast } from 'react-hot-toast'


const Verification = () => {
    const [employer, setEmployer] = useState<Employer | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [verified,setVerifying]=useState(false)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchEmployerDetails = async () => {
            try {
                if (id) {
                    const employerData = await individualDetails(id,'employer')
                    setEmployer(employerData[0] || null); 
                }
            }
            catch (error) {
                console.log('error occured while fetching emplloyder details',error)
                setError("Failed to load employer details")
            }
            finally {
                setLoading(false)
            }
        }
        fetchEmployerDetails()
    }, [id])
    console.log("EMPLOYER",employer)

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        )
    }
    const handleVerifyEmployer = async (status:"VERIFIED"|'DENIED') => {
        
        if (id) {
            setVerifying(true)
            try {
                const response=await verifyEmployer(id, status)
                console.log("in handle verify",response)
                if(response?.success===true)
                {
                    toast.success(response.message)
                    setEmployer((prevEmployer) => ({
                    ...prevEmployer!,
                    isVerified: status,
                }));

                    
                }
            } catch (error) {
                toast.error("Error occured during verifying employer")
                console.log('failed',error)
                throw new Error("Error occurred during verifying employer")
            }
            finally
            {
                setVerifying(false)
            }
        }
    }
   

    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 min-h-screen bg-gray-50 ml-72 mt-10 ">
            <div className="max-w-5xl">
                <div className="flex items-start gap-8">
                    <div className="w-32 h-32 bg-white rounded-lg shadow overflow-hidden flex items-center justify-center">
                        {employer?.logo ? (
                            <img 
                                    src={`http://localhost:4000/uploads/company-logos/${employer.logo.split("\\").pop()}`}
                                alt={`${employer.companyName} logo`}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <Building2 className="w-16 h-16 text-gray-400"/>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{employer?.companyName}</h1>
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                            {employer?.industry}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400"/>
                            <div>
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="text-gray-900">{employer?.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400"/>
                            <div>
                                <div className="text-sm text-gray-500">Location</div>
                                <div className="text-gray-900">{employer?.location}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400"/>
                            <div>
                                <div className="text-sm text-gray-500">Employee Count</div>
                                <div className="text-gray-900">{employer?.employees}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400"/>
                            <div>
                                <div className="text-sm text-gray-500">Date Founded</div>
                                <div className="text-gray-900">
                                    {employer?.dateFounded ? new Date(employer.dateFounded).toLocaleDateString() : "N/A"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 md:col-span-2">
                            <Globe className="w-5 h-5 text-gray-400"/>
                            <div>
                                <div className="text-sm text-gray-500">Website</div>
                                <a 
                                    href={employer?.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                        {employer ? employer.website : "No website available."}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Company Description
                    </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {employer ? employer.description : "No description available."}
                        </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Verification Details
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <div className="text-sm text-gray-500">Document Type</div>
                            <div className="mt-1 text-gray-900">{employer?.documentType}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Document Number</div>
                            <div className="mt-1 text-gray-900">{employer?.documentNumber}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-2">Uploaded Documents</div>
                            {employer?.document ? (
                                <a 
                                        href={`http://localhost:4000/uploads/company-documents/${employer.document.split("\\").pop()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    View Document
                                </a>
                            ) : (
                                <div className="text-gray-500">No documents uploaded</div>
                            )}
                        </div>
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-500">Verification Status</div>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            employer?.isVerified==="PENDING" ? 'bg-yellow-100 text-yellow-800':
                                            employer?.isVerified==="VERIFIED"?'bg-green-100 text-green-800':
                                            employer?.isVerified==="DENIED"?'bg-red-100 text-red-800':
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {employer?.isVerified === "PENDING"?"Pending Verification":
                                            employer?.isVerified === "VERIFIED"?"Verified":
                                            employer?.isVerified ==="DENIED"?"Denied":
                                                "Not Verified"}

                                            
                                        </span>
                                    </div>
                                </div>
                                <div className="space-x-2">
                                    {employer?.isVerified==='PENDING'&&(
                                        <>
                                                <button
                                                    onClick={()=>handleVerifyEmployer("VERIFIED")}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyEmployer("DENIED")}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    {verified ?<Spinner loading={true}/>:"Deny"}
                                                </button>
                                        </>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Verification

