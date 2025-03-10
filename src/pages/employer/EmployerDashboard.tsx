import SideBar from "./SideBar"
import { AlertCircle, Plus, Briefcase, Users, Calendar, DollarSign } from "lucide-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { isVerified, fetchJobs } from "../../services/employerService";
import { IEmployer } from "../../types/Employer";
import { jobFormData } from "../../types/Employer";
const EmployerDashboard = () => {
    const employer = useSelector((state: { user: IEmployer }) => state.user)
    const navigate = useNavigate()
    const [verified, setVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [jobListings, setJobListings] = useState<jobFormData[]>([])
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplicants: 0,
        recentApplications: 0
    })
    interface Job {
        isActive: boolean;
        applicantsCount?: number;
      }
    const handlePostJob = () => {
        navigate('/addjob')
    }
    const handleViewJobs = () => {
        navigate('/joblistings')
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const verificationResponse = await isVerified()
                if (verificationResponse.data.message === 'isVerified') {
                    setVerified(true)
                }
                const jobsResponse = await fetchJobs()
                console.log('jobresponse',jobsResponse)
                const jobs = jobsResponse.data
                setJobListings(jobs)
                const activeJobs: number = jobs.filter((job: Job) => job.isActive).length;
                const totalApplicants: number = jobs.reduce((sum: number, job: Job) => sum + (job.applicantsCount || 0), 0);
                const recentApplications = Math.floor(totalApplicants * 0.2) 
                setStats({
                    totalJobs: jobs.length,
                    activeJobs,
                    totalApplicants,
                    recentApplications
                })
            } catch (error) {
                toast.error('Failed to load dashboard data')
                setVerified(false)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])
    const recentJobs = [...jobListings]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 3)
    const StatSkeleton = () => (
        <div className='bg-[#2D3247] rounded-lg p-6 animate-pulse'>
            <div className='h-4 bg-[#404663] rounded w-3/4 mb-4'></div>
            <div className='h-6 bg-[#404663] rounded w-1/2 mb-2'></div>
        </div>
    )
    const JobSkeleton = () => (
        <div className='bg-[#2D3247] rounded-lg p-6 mb-4 animate-pulse'>
            <div className='h-4 bg-[#404663] rounded w-3/4 mb-4'></div>
            <div className='h-3 bg-[#404663] rounded w-1/2 mb-2'></div>
            <div className='h-3 bg-[#404663] rounded w-1/4'></div>
        </div>
    )
    return (
        <div className='flex min-h-screen bg-[#1A1D2B] text-white'>
            <SideBar />
            <main className='flex-1 ml-64 p-8'>
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h2 className='text-2xl font-bold mb-1'>Hi, {employer.companyName}</h2>
                        <p className='text-gray-400'>Here's what's happening with your job listings</p>
                    </div>
                    <button 
                        className={`px-4 py-2 bg-[#6366F1] text-white rounded-lg flex items-center gap-2 ${
                            verified ? 'bg-[#6366F1] text-white' : 'bg-gray-500 text-gray-600 cursor-not-allowed'
                        }`} 
                        onClick={handlePostJob} 
                        disabled={!verified}
                    >
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
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    {isLoading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        <>
                            <div className='bg-[#2D3247] rounded-lg p-6'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='text-gray-400'>Total Jobs</h3>
                                    <div className='p-2 bg-blue-500 bg-opacity-20 rounded-lg'>
                                        <Briefcase size={20} className='text-blue-500' />
                                    </div>
                                </div>
                                <p className='text-3xl font-bold'>{stats.totalJobs}</p>
                                <p className='text-sm text-gray-400 mt-2'>
                                    <span className='text-green-400'>{stats.activeJobs} active</span> jobs
                                </p>
                            </div>
                            <div className='bg-[#2D3247] rounded-lg p-6'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='text-gray-400'>Total Applicants</h3>
                                    <div className='p-2 bg-purple-500 bg-opacity-20 rounded-lg'>
                                        <Users size={20} className='text-purple-500' />
                                    </div>
                                </div>
                                <p className='text-3xl font-bold'>{stats.totalApplicants}</p>
                                <p className='text-sm text-gray-400 mt-2'>
                                    <span className='text-green-400'>+{stats.recentApplications}</span> this week
                                </p>
                            </div>
                            <div className='bg-[#2D3247] rounded-lg p-6'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='text-gray-400'>Active Jobs</h3>
                                    <div className='p-2 bg-green-500 bg-opacity-20 rounded-lg'>
                                        <Briefcase size={20} className='text-green-500' />
                                    </div>
                                </div>
                                <p className='text-3xl font-bold'>{stats.activeJobs}</p>
                                <p className='text-sm text-gray-400 mt-2'>
                                    of {stats.totalJobs} total jobs
                                </p>
                            </div>
                            <div className='bg-[#2D3247] rounded-lg p-6'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='text-gray-400'>Avg. Salary Range</h3>
                                    <div className='p-2 bg-yellow-500 bg-opacity-20 rounded-lg'>
                                        <DollarSign size={20} className='text-yellow-500' />
                                    </div>
                                </div>
                                {jobListings.length > 0 ? (
                                    <>
                                        <p className='text-3xl font-bold'>
                                            ${calculateAvgSalary(jobListings).toLocaleString()}
                                        </p>
                                        <p className='text-sm text-gray-400 mt-2'>
                                            avg. min-max range
                                        </p>
                                    </>
                                ) : (
                                    <p className='text-3xl font-bold'>$0</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className='mb-8'>
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-xl font-bold'>Recent Job Postings</h3>
                        <button 
                            className='text-[#6366F1] hover:underline flex items-center'
                            onClick={handleViewJobs}
                        >
                            View all
                        </button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {isLoading ? (
                            <>
                                <JobSkeleton />
                                <JobSkeleton />
                                <JobSkeleton />
                            </>
                        ) : recentJobs.length > 0 ? (
                            recentJobs.map((job, index) => (
                                <div key={index} className='bg-[#2D3247] rounded-lg p-6 hover:bg-[#343b59] transition duration-300'>
                                    <div className='flex justify-between items-start mb-3'>
                                        <h4 className='font-bold text-lg truncate'>{job.jobTitle}</h4>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            job.isActive 
                                                ? 'bg-green-900 text-green-300' 
                                                : 'bg-gray-700 text-gray-300'
                                        }`}>
                                            {job.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className='space-y-2 mb-4'>
                                        <div className='flex items-center text-gray-400 text-sm'>
                                            <Briefcase size={14} className='mr-2' />
                                            {job.employmentTypes.join(', ')}
                                        </div>
                                        <div className='flex items-center text-gray-400 text-sm'>
                                            <DollarSign size={14} className='mr-2' />
                                            ${job.salaryRange?.min.toLocaleString()} - ${job.salaryRange?.max.toLocaleString()}
                                        </div>
                                        <div className='flex items-center text-gray-400 text-sm'>
                                            <Calendar size={14} className='mr-2' />
                                            Deadline: {formatDate(job.applicationDeadline)}
                                        </div>
                                        <div className='flex items-center text-gray-400 text-sm'>
                                            <Users size={14} className='mr-2' />
                                            {job.applicantsCount || 0} applicants
                                        </div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <button 
                                            className='flex-1 bg-[#6366F1] hover:bg-[#5457d9] text-white py-2 rounded text-sm'
                                            onClick={() => navigate(`/editjob/${job._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className='flex-1 bg-[#2D3247] border border-[#6366F1] text-[#6366F1] py-2 rounded text-sm hover:bg-[#343b59]'
                                            onClick={() => navigate(`/job-applicants/${job._id}`)}
                                        >
                                            View Applicants
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='col-span-3 bg-[#2D3247] rounded-lg p-6 text-center'>
                                <p className='text-gray-400 mb-4'>You haven't posted any jobs yet</p>
                                <button 
                                    className={`px-4 py-2 bg-[#6366F1] text-white rounded-lg inline-flex items-center gap-2 ${
                                        verified ? 'bg-[#6366F1] text-white' : 'bg-gray-500 text-gray-600 cursor-not-allowed'
                                    }`}
                                    onClick={handlePostJob}
                                    disabled={!verified}
                                >
                                    <Plus size={16} />
                                    Post your first job
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(dateString));
}
const calculateAvgSalary = (jobs: jobFormData[]): number => {
    if (!jobs || jobs.length === 0) return 0;
    let totalMin = 0;
    let totalMax = 0;
    let count = 0;
    jobs.forEach(job => {
        if (job.salaryRange?.min && job.salaryRange?.max) {
            totalMin += job.salaryRange.min;
            totalMax += job.salaryRange.max;
            count++;
        }
    });
    if (count === 0) return 0;
    return Math.round((totalMin + totalMax) / (2 * count));
}
export default EmployerDashboard