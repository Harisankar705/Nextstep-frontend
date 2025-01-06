import { ChevronLeft, FolderRoot } from "lucide-react"
import { useEffect, useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { PerksAndBenefits } from "./PerksAndBenefits"
import { JobInformation } from "./JobInformation"
import { Jobdescription } from "./JobDescription"
import toast from "react-hot-toast"
import { fetchJobById, fetchJobs, postjob, updateJob } from "../../../services/employerService"
import { jobFormData } from "../../../types/Employer"
import { useNavigate, useParams } from "react-router-dom"

export const JobPostingForm = () => {
    const navigate=useNavigate()
    const {jobId}=useParams()
    const [isEditing,setIsEditing]=useState(!!jobId)
    const [currentStep, setCurrentStep] = useState(1)
    const [submitting,setIsSubmitting]=useState(false)
    const [formData, setFormData] = useState<jobFormData>({
        jobTitle: "",
        employmentTypes: [],
        salaryRange: { min: 5000, max: 22000 },
        categories: [],
        skills: [],
        responsibilities: '',
        whoYouAre: "",
        niceToHave: "",
        benefits: [],
        industry:[]
        
    })
    useEffect(()=>{
        const fetchJobData=async()=>{
            if(jobId)
            {
                try {
                    const response=await fetchJobById(jobId)
                    console.log('fetchedjob',response)
                    if(response)
                    {
                        const jobData=await response.data
                        setFormData(jobData)
                    }
                } catch (error) {
                    console.log('error occured while fetching jobs',error)
                }
            }
        }
        fetchJobData()
    },[jobId,isEditing])
    const steps = [
        { number: 1, title: "Job Information", component: JobInformation },
        { number: 2, title: "Job Description", component: Jobdescription },
        { number: 3, title: "Perks & Benefits", component: PerksAndBenefits },

    ]
    const CurrentStepComponent = steps[currentStep - 1].component
    const handleNext = () => {
        console.log('in handle next')
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }
    const handleFinalSubmit=async ()=>{
        console.log('in handlefinal submit')
        setIsSubmitting(true)
        try {
            const requiredFields=[
                'jobTitle','employmentTypes','responsibilities','whoYouAre','industry'
            ]
            const missingFields = requiredFields.filter(field => 
                !formData[field] || 
                (Array.isArray(formData[field]) && formData[field].length === 0)    
            )
            console.log('missing fields',missingFields)         
            if(missingFields.length>0)
                {
                    toast.error("Please fill all the following fields")
                    return
                }   
                console.log(isEditing)
                const response = isEditing ? await updateJob(jobId as string, formData) : await postjob(formData);
                            if(response.status===200)
            {
                toast.success("Job updated!")
                setTimeout(()=>{
                    navigate('/joblistings')
                },2000)
            }
        } catch (error) {
            toast.error("Failed to update job")
        }
    }
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
            <div className="max-w-5xl mx-auto">
                <button onClick={handleBack}
                    className="flex items-center text-gray-400 hover:text-white mb-6">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Add Job</span>
                </button>
                <StepIndicator steps={steps} currentStep={currentStep} />
                <div className="mt-8">
                    <CurrentStepComponent formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNext} 
                        onSubmit={handleFinalSubmit}/>
                </div>

            </div>
        </div>
    )
}
