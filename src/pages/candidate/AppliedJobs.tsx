import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../utils/Spinner";
import { Briefcase, Building2, Calendar, Clock, DollarSign } from "lucide-react";
import { AppliedJob } from "../../types/Candidate";
import { fetchAppliedJobs } from "../../services/commonService";
import Navbar from "../../utils/Navbar";
import { useNavigate } from "react-router-dom";
export const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetchAppliedJobs();
        console.log(response)
        setAppliedJobs(response);
      } catch (error) {
        toast.error("Failed to  fetch applied jobs!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  const handleViewJobs=(jobId:string)=>{
    navigate(`/job-details/${jobId}`)
  }
  const getStatusColor=(status:string)=>{
    const colors={
        accepted:"bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        rejected:"bg-red-500/20 text-red-400 border-red-500/30",
        interview:"bg-blue-500/20 text-blue-400 border-blue-500/30",
        pending:"bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    }
    return colors[status as keyof typeof colors]||'bg-gray-500/200 text-gray-400 border-gray-500/30'
  }
  const formatSalary=(amount:number)=>{
    return new Intl.NumberFormat('en-US',{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(amount)
  }
  if (loading) return <Spinner loading={true} />;
  return (
    <div className="min-h-screen bg-black text-white">
        <Navbar/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-sm md:text-3xl  mb-8 text-transparent text-center bg-clip-text bg-gradient-to-r from-blue-400 to purple-400">
          Applied Jobs
        </h1>
        <div className="space-y-6">
          {appliedJobs.map((job, index) => (
            <div
              key={index}
              className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-[1px] hover:from-blue-900 hover:to-purple-900 transition-all duration-300 cursor-pointer"
              onClick={()=>handleViewJobs(job.jobId._id)}
            >
              <div className="bg-black rounded-xl p-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    <div className="flex items-center space-x-4">
      {/* Logo */}
      <img
        src={job.jobId.employerId.logo}
        alt="Company Logo"
        className="w-12 h-12 rounded-full object-cover border border-gray-600"
      />
      
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">
          {job.jobId.jobTitle}
        </h2>
        <div className="flex items-center text-gray-400">
          <Building2 className="w-4 h-4 mr-2" />
          <span>{job.jobId.employerId.companyName}</span>
        </div>
      </div>
    </div>

    {/* Application Status */}
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(
        job.applicationStatus
      )}`}
    >
      <span className="text-sm font-medium capitalize">
        {job.applicationStatus}
      </span>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="flex items-center text-gray-400">
      <Briefcase className="w-4 h-4 mr-2" />
      <span className="text-sm">{job.jobId.employmentTypes.join(", ")}</span>
    </div>
    <div className="flex items-center text-gray-400">
      <DollarSign className="w-4 h-4 mr-2" />
      <span className="text-sm">
        {formatSalary(job.jobId.salaryRange.min)} - {formatSalary(job.jobId.salaryRange.max)}
      </span>
    </div>
    <div className="flex items-center text-gray-400">
      <Calendar className="w-4 h-4 mr-2" />
      <span className="text-sm">
        Due {new Date(job.jobId.applicationDeadline).toLocaleDateString()}
      </span>
    </div>
  </div>

  <div className="mt-4 flex items-center text-xs text-gray-400">
    <Clock className="w-3 h-3 mr-1" />
    <span>Applied On {new Date(job.appliedAt).toLocaleDateString()}</span>
  </div>
</div>

            </div>
          ))}
          {appliedJobs.length===0 && (
            <div className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto text-gray-600 mb-4"/>
                <p className="text-gray-400">You haven't applied to any jobs yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
