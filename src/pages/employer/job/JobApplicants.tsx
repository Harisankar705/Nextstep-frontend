import  { useEffect, useState } from 'react';
import { ArrowLeft, MoreHorizontal, Search, ChevronDown } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApplicantsForJob } from '../../../services/employerService'; 
import Spinner from '../../../utils/Spinner';
import { Applicant } from '../../../types/Candidate';
const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const fetchJobApplicants = async () => {
      try {
        if (jobId) {
          const response = await fetchApplicantsForJob(jobId); // Pass searchTerm
          setApplicants(response.data.data.applicants);
          setTotalApplicants(response.data.data.total); 
        }
      } catch (err) {
        setError('Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchJobApplicants();
  }, [jobId, page, searchTerm]); 
  if (loading) {
    return <Spinner loading={true} />;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleApplicantDetails = (userId: string, jobId: string|undefined) => {
    navigate(`/applicant/${userId}/${jobId}`); 
};
  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Job Applicants</h1>
              <p className="text-sm text-gray-400">Social Media Assistant • Full-Time • {totalApplicants} Applicants</p>
            </div>
            <div className="ml-auto">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-teal-400">
                More Action
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-[#1A1F26] text-teal-400 rounded-lg">Applicants</button>
            <button className="px-4 py-2 hover:bg-[#1A1F26] rounded-lg">Job Details</button>
            <button className="px-4 py-2 hover:bg-[#1A1F26] rounded-lg">Analytics</button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Applicants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1A1F26] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>
        <div className="bg-[#1A1F26] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left">Full Name <ChevronDown size={16} /></th>
                <th className="px-6 py-4 text-left">Hiring Stage</th>
                <th className="px-6 py-4 text-left">Applied Date</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant._id} className="border-b border-gray-800 hover:bg-[#242931]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={applicant.userId.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                      {applicant.userId.firstName} {applicant.userId.secondName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${applicant.applicationStatus === 'Hired' ? 'bg-teal-400/20 text-teal-400' : applicant.applicationStatus === 'Declined' ? 'bg-red-400/20 text-red-400' : 'bg-orange-400/20 text-orange-400'}`}>
                      {applicant.applicationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(applicant.appliedAt))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                    <button 
  onClick={() => handleApplicantDetails(applicant.userId._id, jobId)} 
  className="px-4 py-1 text-sm bg-[#0D1117] hover:bg-gray-800 rounded-lg"
>
  See Details
</button>                    <button className="p-1 hover:bg-gray-800 rounded-lg"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            View
            <select className="mx-2 bg-[#1A1F26] rounded px-2 py-1">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            Applicants per page
          </div>
          <div className="flex gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1F26] hover:bg-gray-800"
              onClick={() => handlePageChange(page - 1)} 
              disabled={page === 1}
            >
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-400 text-black">{page}</button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1F26] hover:bg-gray-800"
              onClick={() => handlePageChange(page + 1)}
              disabled={page * 10 >= totalApplicants}
            >
              &gt;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default JobApplicants;
