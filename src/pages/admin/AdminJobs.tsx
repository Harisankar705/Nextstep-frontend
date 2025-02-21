import { useState } from "react";
import { jobFormData } from "../../types/Employer";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

interface AdminJobProps {
  jobs: jobFormData[]|null;
  onDelete: (id: string) => void;
}
export const AdminJobs: React.FC<AdminJobProps> = ({ jobs, onDelete }) => {
  const [deletingJobId, setJobDeletingJobId] = useState<string | null>(null);
  const handleDelete = async (jobId: string) => {
    setJobDeletingJobId(jobId);
    try {
      await onDelete(jobId)
    } catch (error) {
      toast.error("Failed to delete!");
    } finally {
      setJobDeletingJobId(null);
    }
  };
  
  return (
    <div className="space-y-4">
      {jobs?.map((job) => (
        <div key={job._id} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900">
                {job.jobTitle}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.employmentTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                  >
                    {type}
                  </span>
                ))}
                {job.industry.map((industry) => (
                  <span
                    key={industry}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                  >
                    {industry}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-slate-600">
                <p className="inline-clamp-2">{job.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <div>
                    <span className="font-medium">Salary Range:</span>
                    {job.salaryRange.min}-{job.salaryRange.max}
                </div>
                <div>
                    <span className="font-medium">Applicants:</span>
                    {job.applicantsCount}
                </div>
              </div>
            </div>
            <button onClick={()=>handleDelete(job._id as string)}
            disabled={deletingJobId===job._id}
            className="ml-4 p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete job">
                {deletingJobId===job._id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"/>
                ):(
                    <Trash2 className="w-5 h-5"/>
                )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
