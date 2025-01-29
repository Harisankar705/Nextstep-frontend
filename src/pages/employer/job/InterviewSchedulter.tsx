import React, { useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { InterviewScheduleProps } from '../../../types/Candidate';
import toast from 'react-hot-toast';
import { InterviewScheduleData } from '../../../types/Employer';
const InterviewScheduler: React.FC<InterviewScheduleProps> = ({ applicant, onScheduleInterview }) => {
  const [scheduleData, setScheduleData] = useState<InterviewScheduleData>({
    date: '',
    time: '',
    interviewer: '',
    platform: 'video',
    meetingLink: '',
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledInterview, setScheduledInterview] = useState<InterviewScheduleData | null>(null); // New state for scheduled interview
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsScheduling(true);
    try {
      await onScheduleInterview(scheduleData);
      setScheduledInterview(scheduleData);
      toast.success("Interview scheduled!");
      setScheduleData({
        date: '',
        time: '',
        interviewer: '',
        platform: 'video',
        meetingLink: '',
      });
    } catch (err) {
      setError('Failed to schedule interview. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Schedule Interview</h3>
        {applicant?.interviewSchedule && (
          <span className="text-[#2DD4BF] text-sm">
            Currently scheduled for: {new Date(applicant.interviewSchedule.date).toLocaleString()}
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Interview Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={scheduleData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0B0E14] rounded-lg pl-10 focus:ring-2 focus:ring-[#2DD4BF] focus:outline-none"
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Interview Time
            </label>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={scheduleData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0B0E14] rounded-lg pl-10 focus:ring-2 focus:ring-[#2DD4BF] focus:outline-none"
                required
              />
              <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Interviewer
            </label>
            <div className="relative">
              <input
                type="text"
                name="interviewer"
                value={scheduleData.interviewer}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0B0E14] rounded-lg pl-10 focus:ring-2 focus:ring-[#2DD4BF] focus:outline-none"
                placeholder="Enter interviewer name"
                required
              />
              <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Interview Platform
            </label>
            <div className="relative">
              <select
                name="platform"
                value={scheduleData.platform}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0B0E14] rounded-lg pl-10 focus:ring-2 focus:ring-[#2DD4BF] focus:outline-none appearance-none"
                required
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In Person</option>
              </select>
              <Video className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          {scheduleData.platform === 'video' && (
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Meeting Link
              </label>
              <input
                type="url"
                name="meetingLink"
                value={scheduleData.meetingLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0B0E14] rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:outline-none"
                placeholder="Enter meeting link (optional)"
              />
            </div>
          )}
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isScheduling}
            className="px-6 py-2 bg-[#2DD4BF] text-black rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </form>
      {scheduledInterview && (
        <div className="mt-6 p-4 bg-[#1F2937] rounded-lg">
          <h4 className="text-lg font-semibold text-[#2DD4BF]">Scheduled Interview</h4>
          <p><strong>Date:</strong> {scheduledInterview.date}</p>
          <p><strong>Time:</strong> {scheduledInterview.time}</p>
          <p><strong>Interviewer:</strong> {scheduledInterview.interviewer}</p>
          <p><strong>Platform:</strong> {scheduledInterview.platform}</p>
          {scheduledInterview.meetingLink && (
            <p><strong>Meeting Link:</strong> <a href={scheduledInterview.meetingLink} className="text-blue-500">{scheduledInterview.meetingLink}</a></p>
          )}
        </div>
      )}
    </div>
  );
};
export default InterviewScheduler;