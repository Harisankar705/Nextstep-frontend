import { JobDescriptionProps } from "../../../types/Employer"
import { RichTextEditor } from "./RichTextEditor"

export const Jobdescription = ({formData,updateFormData,onNext}:JobDescriptionProps) => {
  return (
   <div className="space-y-8">
    <div>
        <h2 className="text-xl mb-2">Details</h2>
        <p className="text-gray-400 text-sm mb-6">
            Add the description of the jobs,responsibilities,who you are, and nice-to-haves.
        </p>
        <div className="space-y-6">
            <RichTextEditor label="Job Description" value={formData.description} 
            onChange={(value)=>updateFormData({description:value})}
            placeholder="Enter the job description!"/>
                  <RichTextEditor label="responsibilities" value={formData.responsibilities}
                      onChange={(value) => updateFormData({ responsibilities:value})}
            placeholder="Outline the core responsibilities of the position!"/>
            <RichTextEditor label="Who You Are" value={formData.whoYouAre}
            onChange={(value)=>updateFormData({whoYouAre:value})}
            placeholder="Add you preferred candidates qualifications!"/>
            <RichTextEditor label="Nice-To-Haves" value={formData.niceToHave}
            onChange={(value)=>updateFormData({niceToHave:value})}
            placeholder="Add nice-to-have skills and qualifications!"/>
        </div>
    </div>
    <div className="flex justify-end">
        <button onClick={onNext} className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Next step</button>
    </div>
   </div>
  )
}
