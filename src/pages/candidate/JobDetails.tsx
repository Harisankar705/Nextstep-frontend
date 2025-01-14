import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Building2,
  CheckCircle,
  Globe, 
  Mail,  
} from "lucide-react";
import { useParams } from "react-router-dom";
import { applyJob, fetchJobById } from "../../services/employerService";
import toast from "react-hot-toast";
import Spinner from "../../utils/Spinner";
import { JobType } from "../../types/Candidate";
import { getCompanyLogo } from "../../utils/ImageUtils";
import Navbar from "../../utils/Navbar";

const JobDetails = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [job, setJob] = useState<JobType | null>(null);
  const [isApplying,setIsApplying]=useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const response = await fetchJobById(id);
        
        const jobData: JobType = response.data;
        setJob(jobData);
      } catch (error) {
        toast.error("Error fetching job details");
        console.error("Error fetching job details",error);
      } finally {
        setIsLoading(false);
      }
    };
    getJobDetails();
  }, [id]);
  const handleApplyClick=async()=>{
    if(!job?._id)
    {
        toast.error('Job ID is not available')
        return
    }
    setIsApplying(true)
    try {
        
        const response=await applyJob(job._id)
        if(response.status===200)
        {
            toast.success("Application submitted successfully!")
            setJob((prev) => prev && { ...prev, hasApplied: true }); 

        }
        else
        {
            toast.error("Error applying for this job!")
        }
    } catch (error) {
        toast.error("Something went wrong.Try again!")
        console.error("Something went wrong.Try again!",error)
    }
    finally
    {
        setIsApplying(false)
    }
  }

  if (isLoading) {
    return <Spinner loading={true} />;
  }
  if (!job) {
    return <div className="text-center text-gray-400">Job not found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 ">
         <Navbar />
      <div className="max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  <img src={getCompanyLogo(job.employerId?.logo)} alt="Company Logo" />
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{job.jobTitle}</h1>
                <div className="flex items-center text-gray-400 gap-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-teal-500" />
                    {job.employerId?.companyName || "Unknown Company"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    {job.location || "Not Specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gray-800 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Job Description</h2>
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </div>

            {/* Required Knowledge */}
            <div className="bg-gray-800 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Required Knowledge, Skills, and Abilities
              </h2>
              <ul className="space-y-3 text-gray-300">
                {job.skills?.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-gray-800 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Responsibilities</h2>
                <p className="text-gray-300 leading-relaxed">{job.responsibilities}</p>
              </div>
            )}

            {/* Nice to Have */}
            {job.niceToHave && (
              <div className="bg-gray-800 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Nice to Have</h2>
                <p className="text-gray-300 leading-relaxed">{job.niceToHave}</p>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Benefits</h2>
                <ul className="space-y-3 text-gray-300">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-500" />
                      <div>
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <p>{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Job Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-400">Posted date:</p>
                    <p>{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {job.applicationDeadline && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-400">Deadline:</p>
                      <p>{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-400">Salary:</p>
                    <p>${job.salaryRange.min} - ${job.salaryRange.max} yearly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Briefcase className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-400">Employment Type:</p>
                    <p>{job.employmentTypes.join(", ")}</p>
                  </div>
                </div>
              </div>
              <button
  className={`w-full ${
    job.isActive && !job.hasApplied
      ? "bg-teal-500 hover:bg-teal-600"
      : "bg-gray-500 cursor-not-allowed"
  } text-white font-semibold py-3 px-6 rounded-lg mt-6 transition-colors`}
  disabled={!job.isActive || job.hasApplied}
  onClick={handleApplyClick}
>
  {job.hasApplied ? " Applied" : job.isActive ? "Apply Now" : "Job Closed"}
</button>


            </div>
            <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Company Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Building2 className="w-5 h-5 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-400">Name:</p>
                  {job.employerId?.companyName || "Unknown Company"}
                  </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Globe className="w-5 h-5 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-400">Web:</p>
                  {job.employerId?.website || "Unknown Company"}
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-400">Email:</p>
                  {job.employerId?.email || "Unknown Company"}
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Company Info */}
          
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
