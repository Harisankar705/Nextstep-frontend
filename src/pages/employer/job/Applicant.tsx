import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Mail, Phone, Instagram, Twitter, Globe, MoreHorizontal, ChevronDown } from 'lucide-react';
import { applicantDetails, individualDetails } from '../../../services/adminService';
import { UserCandidate } from '../../../types/Candidate';
import InterviewScheduler from './InterviewSchedulter';
import { InterviewScheduleData } from '../../../types/Employer';
import { scheduleInterview } from '../../../services/commonService';
import toast from 'react-hot-toast';
import { changeApplicationStatus } from '../../../services/employerService';
import Spinner from '../../../utils/Spinner';
type ApplicationStatus =  'Pending' | 'Accepted' |'In-review'|'Shortlisted'| 'Rejected' |'Interview'| 'Interview Scheduled' | 'Interview Completed';
const statusOrder = ['pending' ,'accepted' ,'in-review','shortlisted', 'rejected' ,'interview', 'Interview Scheduled' , 'interviewCompleted'];
const getStatusIndex = (status: ApplicationStatus) => {
  return statusOrder.indexOf(status);
};
const getProgressWidth = (status: ApplicationStatus) => {
  const index = getStatusIndex(status);
  return index === -1 ? '0%' : `${(index / (statusOrder.length - 1)) * 100}%`;
};
const Applicant = () => {
  const { userId, jobId } = useParams<{ userId: string; jobId: string }>();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState<UserCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('Pending');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isScheduling,setIsScheduling]=useState(false)
  const [isChangingStatus,setIsChangingStatus]=useState(false)
  const handleScheduleInterview = async (scheduleData: InterviewScheduleData) => {
    try {
      setIsScheduling(true)
      if (!userId || !jobId) {
        throw new Error('User  ID or Job ID is missing');
      }
      const response = await scheduleInterview(scheduleData, userId, jobId);
      if (response.status === 200) {
        toast.success("Interview scheduled!");
      } else {
        toast.error("Failed to schedule interview.");
      }
    } catch (error) {
      toast.error("An error occurred while scheduling the interview.");
    }
    finally{
      setIsScheduling(false)
    }
  };
  useEffect(() => {
    const fetchApplicant = async () => {
        try {
            const userResponse = await individualDetails(userId, 'user');
            const user = userResponse[0];
            const applicationStatus = await applicantDetails(userId, jobId); 
            setApplicant(user);
            setApplicationStatus(applicationStatus as ApplicationStatus); 
        } catch (err) {
            setError('Failed to load applicant details');
        } finally {
            setLoading(false);
        }
    };
    fetchApplicant();
}, [userId, jobId]); 
  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setIsChangingStatus(true)
    try {
      await changeApplicationStatus(newStatus,userId as string)
      setApplicationStatus(newStatus);
      setShowStatusDropdown(false);
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error("Failed to update status.");
    }
    finally{
      setIsChangingStatus(false)
    }
  };
  const StatusDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowStatusDropdown(!showStatusDropdown )}
        className="px-4 py-2 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-lg flex items-center gap-2 hover:bg-[#2DD4BF]/20 transition-colors"
      >
        Change Status
        <ChevronDown size={16} />
      </button>
      {showStatusDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-[#151923] rounded-lg shadow-lg overflow-hidden z-10">
          {statusOrder.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status as ApplicationStatus)}
              className={`w-full px-4 py-2 text-left hover:bg-[#2DD4BF]/10 transition-colors ${
                status === applicationStatus ? 'text-[#2DD4BF] bg-[#2DD4BF]/5' : 'text-gray-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
  const renderContent = () => {
    switch (activeTab) {
      case 'hiring':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current Stage</h3>
              <StatusDropdown />
            </div>
            <div className="relative">
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-700">
                <div
                  className="h-full bg-[#2DD4BF] transition-all duration-500 ease-in-out"
                  style={{ width: getProgressWidth(applicationStatus) }}
                ></div>
              </div>
              <div className="relative flex justify-between">
                {statusOrder.map((status, index) => {
                  const isCompleted = getStatusIndex(applicationStatus) >= index;
                  const isCurrent = applicationStatus === status;
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isCompleted ? 'bg-[#2DD4BF]' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            isCompleted ? 'text-black' : 'text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isCurrent
                            ? 'text-[#2DD4BF]'
                            : isCompleted
                            ? 'text-gray-300'
                            : 'text-gray-400'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-8 p-4 bg-[#0B0E14] rounded-lg">
              <h4 className="text-[#2DD4BF] font-medium mb-2">
                Current Status: {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
              </h4>
              <p className="text-gray-400">
                {applicationStatus === 'Pending' && 'Application is awaiting initial review.'}
                {applicationStatus === 'Accepted' && 'Application is currently being reviewed by the hiring team.'}
                {applicationStatus === 'In-review' && 'Candidate has been shortlisted for interview.'}
                {applicationStatus === 'Shortlisted' && 'Interview process is in progress.'}
                {applicationStatus === 'Rejected' && 'Candidate has been selected for the position.'}
                {applicationStatus === 'Interview' && 'Application has been declined.'}
                {applicationStatus === 'Interview Scheduled' && 'Application has been declined.'}
                {applicationStatus === 'Interview Completed' && 'Application has been declined.'}
              </p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 mb-1">Full Name</p>
                  <p>{applicant?.firstName} {applicant?.secondName}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Gender</p>
                  <p>{applicant?.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Date of Birth</p>
                  <p>{applicant?.dateOfBirth ? new Date(applicant.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Language</p>
                  <p>{applicant?.languages?.join(", ") || 'Not specified'}</p>
                </div>
                <div className="col-span-full">
                  <p className="text-gray-400 mb-1">Address</p>
                  <p>{applicant?.location || 'Not specified'}</p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-lg font-semibold mb-4">Professional Info</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 mb-1">About Me</p>
                  <p className="leading-relaxed">{applicant?.aboutMe || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 mb-1">Current Job</p>
                    <p>{applicant?.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant?.skills?.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {applicant?.education && applicant.education.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="space-y-6">
                  {applicant.education.map((edu, index) => (
                    <div key={index} className="bg-[#0B0E14] p-4 rounded-lg">
                      <p className="text-[#2DD4BF] mb-1">{edu.degree}</p>
                      <p className="text-sm text-gray-400">{edu.institution}</p>
                      <p className="text-sm text-gray-400">({edu.year})</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      case 'resume':
        return (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold mb-4">Resume</h3>
            <div className="bg-[#0B0E14] p-6 rounded-lg">
              {(() => {
                const resumePath = applicant?.resume?.[0];
              
                return (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Resume</h3>
                      {resumePath ? (
                        <a
                          href={resumePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Resume
                        </a>
                      ) : (
                        <div className="text-gray-500">No resume uploaded</div>
                      )}
                    </div>
                    {resumePath && resumePath.endsWith('.pdf') ? (
                      <iframe
                        src={resumePath}
                        className="w-full h-[600px] rounded-lg border border-gray-800"
                        title="Resume Preview"
                      />
                    ) : resumePath ? (
                      <div className="bg-[#0B0E14] p-6 rounded-lg">
                        <p>Resume preview not available. Click 'View Resume' to open the document.</p>
                      </div>
                    ) : (
                      <div className="bg-[#0B0E14] p- 6 rounded-lg">
                        <p>No resume available.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        );
      case 'interview':
        return (
          <div className="space-y-8">
            {applicant?.interviewSchedule ? (
              <div className="bg-[#0B0E14] p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-semibold mb-4">Current Interview Schedule</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-1">Date & Time</p>
                    <p>{new Date(`${applicant.interviewSchedule.date} ${applicant.interviewSchedule.time}`).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Interviewer</p>
                    <p>{applicant.interviewSchedule.interviewer}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Platform</p>
                    <p>{applicant.interviewSchedule.platform}</p>
                  </div>
                  {applicant.interviewSchedule.meetingLink && (
                    <div>
                      <p className="text-gray-400 mb-1">Meeting Link</p>
                      <a 
                        href={applicant.interviewSchedule.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2DD4BF] hover:underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            <InterviewScheduler applicant={applicant} onScheduleInterview={handleScheduleInterview} />
          </div>
        );
      default:
        return <div className="text-gray-400">Content not available</div>;
    }
  };
  if (loading || isChangingStatus||isScheduling) {
    return (
      <Spinner loading={true}/>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  if (!applicant) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-gray-400">No applicant found</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <button 
          className="flex items-center gap-2 text-gray-400 hover:text-[#2DD4BF] transition-colors" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          <span>Applicant Details</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#151923] text-[#2DD4BF] rounded-lg hover:bg-opacity-80 transition-colors">
          <span>More Action</span>
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={applicant.profilePicture}
              alt={`${applicant.firstName}'s profile`}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#2DD4BF]"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {applicant.firstName} {applicant.secondName}
              </h2>
              <p className="text-gray-400">{applicant.role === 'user' ? 'Job Seeker' : 'Employer'}</p>
              <div className="flex items-center gap-1 text-[#2DD4BF]">
                <Star size={16} fill="currentColor" />
                <span>{applicant.status}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#151923] rounded-lg p-6">
            <div className=" flex justify-between text-sm mb-4">
              <span className="text-gray-400">Profile Completion</span>
              <span className="text-[#2DD4BF]">85%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-[#2DD4BF] h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <h3 className="font-semibold mb-2">Applied Jobs</h3>
            <p className="text-gray-400 text-sm">
              {applicant.role === 'user' ? 'Job Seeker Profile' : 'Employer Profile'}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              {applicant.email && (
                <a href={`mailto:${applicant.email}`} className="flex items-center gap-3 text-gray-400 hover:text-[#2DD4BF] transition-colors">
                  <Mail size={18} />
                  <span>{applicant.email}</span>
                </a>
              )}
              {applicant.phonenumber && (
                <a href={`tel:${applicant.phonenumber}`} className="flex items-center gap-3 text-gray-400 hover:text-[#2DD4BF] transition-colors">
                  <Phone size={18} />
                  <span>{applicant.phonenumber}</span>
                </a>
              )}
              {applicant.instagram && (
                <a href={applicant.instagram} className="flex items-center gap-3 text-gray-400 hover:text-[#2DD4BF] transition-colors" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
              )}
              {applicant.twitter && (
                <a href={applicant.twitter} className="flex items-center gap-3 text-gray-400 hover:text-[#2DD4BF] transition-colors" target="_blank" rel="noopener noreferrer">
                  <Twitter size={18} />
                  <span>Twitter</span>
                </a>
              )}
              {applicant.website && (
                <a href={applicant.website} className="flex items-center gap-3 text-gray-400 hover:text-[#2DD4BF] transition-colors" target="_blank" rel="noopener noreferrer">
                  <Globe size={18} />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-[#151923] rounded-lg p-6">
          <div className="flex gap-8 mb-8 border-b border-gray-800 overflow-x-auto">
            <button 
              className={`pb-4 whitespace-nowrap transition-colors ${
                activeTab === 'profile' 
                  ? 'text-[#2DD4BF] border-b-2 border-[#2DD4BF]' 
                  : 'text-gray-400 hover:text-[#2DD4BF]'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Applicant Profile
            </button>
            <button 
              className={`pb-4 whitespace-nowrap transition-colors ${
                activeTab === 'resume' 
                  ? 'text-[#2DD4BF] border-b-2 border-[#2DD4BF]' 
                  : 'text-gray-400 hover:text-[#2DD4BF]'
              }`}
              onClick={() => setActiveTab('resume')}
            >
              Resume
            </button>
            <button 
              className={`pb-4 whitespace-nowrap transition-colors ${
                activeTab === 'hiring' 
                  ? 'text-[#2DD4BF] border-b-2 border-[#2DD4BF]' 
                  : 'text-gray-400 hover:text-[#2DD4BF]'
              }`}
              onClick={() => setActiveTab('hiring')}
            >
              Hiring Progress
            </button>
            <button 
              className={`pb-4 whitespace-nowrap transition-colors ${
                activeTab === 'interview' 
                  ? 'text-[#2DD4BF] border-b-2 border-[#2DD4BF]' 
                  : 'text-gray-400 hover:text-[#2DD4BF]'
              }`}
              onClick={() => setActiveTab('interview')}
            >
              Interview Schedule
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default Applicant;