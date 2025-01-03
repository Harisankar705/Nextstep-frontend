import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { jobFormData } from "../../../types/Employer";
import { fetchJobs } from "../../../services/employerService";
import Spinner from "../../../utils/Spinner";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

export const JobListing = () => {
    const navigate=useNavigate()
  const [jobListings, setJobListings] = useState<jobFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchJobListing = async () => {
      try {
        const response = await fetchJobs();
        console.log("responsesss", response);
        setJobListings(response.data);
      } catch (error) {
        setError("Failed to fetch job listings");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobListing();
  }, []);
  const handleEditClick=(jobId:string)=>{
    navigate('/editjobs')
  }
  if (loading) {
    return <Spinner loading={true} />;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  console.log("joblistings", jobListings);
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
        <SideBar />
      <div className="flex-1 max-w-7xl mx-auto ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Job Listing</h1>
            <p className="text-gray-400">Here is your job listings!</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2">
            <span>Dates</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Job List</h2>
            <button className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr className="text-left">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Posted</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Job Type</th>
                <th className="p-4">Applicants</th>
                <th className="p-4">View</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {jobListings.map((job, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-4">{job.jobTitle}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        job.isActive === "true"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-teal-400 text-black"
                      }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(job.createdAt))}
                  </td>
                  <td className="p-4">{job.applicants}</td>
                  <td className="p-4">{job.employmentTypes}</td>
                  <td className="p-4">{job.applicants || 0}</td>
                  <td className="p-4">
                    <button className="flex justify-between items-center bg-teal-300 px-4 rounded-lg text-black" onClick={()=>handleEditClick(job.id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <span>view</span>
              <button className="flex items-center space-x-1 bg-gray-700 px-3 py-1 rounded">
                <span>10</span>
                <ChevronDown size={16} />
              </button>
              <span>Applicants per page</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded hover:bg-gray-700">
                <ChevronLeft size={20} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600">
                2
              </button>
              <button className="p-1 rounded hover:bg-gray-700">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
