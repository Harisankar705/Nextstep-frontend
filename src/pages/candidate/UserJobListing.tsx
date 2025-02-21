import React, { useEffect, useState } from 'react';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter } from 'lucide-react';
import { fetchUserJobs } from '../../services/employerService';
import { JobType } from '../../types/Candidate';
import { Filters } from '../../types/Employer';
import { getCompanyLogo } from '../../utils/ImageUtils';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../utils/Navbar';
import toast from 'react-hot-toast';
const UserJobListing = () => {
  const navigate=useNavigate()
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    jobTypes: [],
    experienceLevels: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchFilteredJobs();
  }, [searchQuery, filters]);
  const fetchFilteredJobs = async () => {
    setIsLoading(true);
    try {
      const params = {
        search: searchQuery,
        jobTypes: filters.jobTypes,
        experienceLevels: filters.experienceLevels,
      };
      const fetchedJobs = await fetchUserJobs(params);
      setJobs(fetchedJobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleViewDetails=(jobId:string)=>{
    navigate (`/job-details/${jobId}`)
  }
  const toggleFilter = (category: 'jobTypes' | 'experienceLevels', value: string) => {
    setFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value];
      return { ...prevFilters, [category]: updatedCategory };
    });
  };
  return (
    <div className="min-h-screen bg-gray-900">
         <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-teal-400" />
                <h2 className="text-xl font-semibold text-white">Filters</h2>
              </div>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {['Full Time', 'Part Time', 'Contract', 'Freelance'].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-gray-300 hover:text-teal-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.jobTypes.includes(type)}
                          onChange={() => toggleFilter('jobTypes', type)}
                          className="rounded border-gray-600 text-teal-500 focus:ring-teal-500"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-3">Experience Level</h3>
                  <div className="space-y-2">
                    {['Entry Level', 'Mid Level', 'Senior', 'Lead'].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-2 text-gray-300 hover:text-teal-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.experienceLevels.includes(level)}
                          onChange={() => toggleFilter('experienceLevels', level)}
                          className="rounded border-gray-600 text-teal-500 focus:ring-teal-500"
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-9">
  {isLoading ? (
    <div className="text-center text-gray-400">Loading jobs...</div>
  ) : jobs.length === 0 ? (
    <div className="text-center text-gray-400">No jobs found. Try adjusting your filters.</div>
  ) : (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job._id} 
          className="bg-gray-800 rounded-lg p-6 hover:border-teal-500 border border-transparent transition-colors"
        >
          <div className="flex items-start gap-4">
            <img
  src={getCompanyLogo(job.employerId?.logo)} 
              alt={job.employerId?.companyName || 'Company'} 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-white">{job.jobTitle}</h3>
                <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                  {job.employmentTypes.join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.employerId?.companyName || 'Company Name'}</span> {/* Replace with actual employer data */}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location || 'Location'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{`${job.salaryRange.min} - ${job.salaryRange.max}`}</span> 
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString():"N/A"}</span>
                </div>
              </div>
              <button className="text-teal-400 hover:text-teal-300 font-medium" onClick={()=>handleViewDetails(job._id as string)}>
                View Details →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
        </div>
      </main>
    </div>
  );
};
export default UserJobListing;
