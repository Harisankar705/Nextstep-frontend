import { useState } from "react";
import { ReportProps } from "../../types/Candidate";
import toast from "react-hot-toast";
import { AlertTriangle, Flag, X } from "lucide-react";
import { createReport } from "../../services/commonService";
const REPORT_REASONS=[
    {value:'spam',label:"Spam or misleading"},
    {value:'inappropriate',label:"Inappropriate Content"},  
    {value:'offensive',label:"Hateful or Offsensive"},  
    {value:'misinformation',label:"False Information"},  
    {value:'sexual content',label:"Sexual Content"},  
    {value:'other',label:"Other"},  
] as const
export const Report: React.FC<ReportProps> = ({ postId, onClose,role }:ReportProps) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting,setIsSubmitting]=useState(false)
  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(!reason)return
    try {
        setIsSubmitting(true)
        const response=await createReport({postId,reason,description,role})
        if(response.status===200)
        {
          toast.success('Report has been submitted!')
        }
        console.log('response',response)
        onClose()
    } catch (error) {
        toast.error("Failed to submit report!")
        console.error(error)
    }
    finally{
        setIsSubmitting(false)
    }
  }

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-6 m-4 border border-teal-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-teal-500/10">
            <Flag className="w-5 h-5 text-teal-400"/>
            </div>
            <h2 className="text-xl font-semibold text-white">Report Content</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-teal-400 transition-colors p-1 rounded-lg hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What's the issue? <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors hover:border-teal-500/50"
              required
            >
              <option value="">Select a reason</option>
             
             {REPORT_REASONS.map(({value,label})=>(
                <option key={value} value={value} className="bg-gray-800">{label}</option>
             ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Additional Details
              <span className="text-gray-500 text-xs ml-2">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Please provide any additional context that will help us understand the issue..."
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-red-teal transition-colors resize-none hover:border-teal-500/50 placeholder-gray-500"
            />
          </div>
          <div className="flex items-start space-x-3 p-3 bg-teal-500/10 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-teal-400 flex-shrink mt-0.5"/>
          <p className="text-sm text-gray-300">
            Reports are taken seriously!False reports may result in account restriction
          </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-teal-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting||!reason}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-500  transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;