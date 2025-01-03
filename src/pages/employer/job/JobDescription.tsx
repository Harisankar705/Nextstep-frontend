import { JobDescriptionProps } from "../../../types/Employer"
import { RichTextEditor } from "./RichTextEditor"

export const Jobdescription = ({formData,updateFormData,onNext}:JobDescriptionProps) => {
    const isEditing=!!formData.jobTitle
  return (
   <div className="space-y-8">
    <div>
        <h2 className="text-xl mb-2">{isEditing?"Edit":"Add"}Job Description</h2>
        <p className="text-gray-400 text-sm mb-6">
            {isEditing ? "Update the job description,responsibilities, and other details":"Add the description of the jobs,responsibilities,who you are, and nice-to-haves."}
            
        </p>
        <div className="space-y-6">
            <RichTextEditor label="Job Description" value={formData.description} 
            onChange={(value)=>updateFormData({description:value})}
            placeholder={isEditing?"Update the job description~":"Enter the job description!"}/>
                  <RichTextEditor label="responsibilities" value={formData.responsibilities}
                      onChange={(value) => updateFormData({ responsibilities:value})}
                      placeholder={isEditing?"Update the responsibilites":"Outline the core responsibilities of the position!"}/>

            
            <RichTextEditor label="Who You Are" value={formData.whoYouAre}
            onChange={(value)=>updateFormData({whoYouAre:value})}
            placeholder={isEditing?"Update the qualifications":"Add you preferred candidates qualifications!"}/>

            <RichTextEditor label="Nice-To-Haves" value={formData.niceToHave}
            onChange={(value)=>updateFormData({niceToHave:value})}
            placeholder={isEditing?"Update the nice-to-have":"Add nice-to-have skills and qualifications!"}/>

        </div>
    </div>
    <div className="flex justify-end">
        <button onClick={onNext} className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Next step</button>
    </div>
   </div>
  )
}
