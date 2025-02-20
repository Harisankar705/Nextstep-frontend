import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { PerksAndBenefits } from "./PerksAndBenefits"
import { JobInformation } from "./JobInformation"
import { Jobdescription } from "./JobDescription"
import toast from "react-hot-toast"
import { fetchJobById, postjob, updateJob } from "../../../services/employerService"
import { jobFormData } from "../../../types/Employer"
import { useNavigate, useParams } from "react-router-dom"
import { JobType } from "../../../types/Candidate"
export const JobPostingForm = () => {
    const navigate = useNavigate()
    const { jobId } = useParams()
    const isEditing = !!jobId
    const [currentStep, setCurrentStep] = useState(1)
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
        industry: [],
        description: "",
    })
    useEffect(() => {
        const fetchJobData = async () => {
            if (jobId) {
                try {
                    const response = await fetchJobById(jobId)
                    if (response) {
                        const jobData = await response.data
                        setFormData(jobData)
                    }
                } catch (error) {
                }
            }
        }
        fetchJobData()
    }, [jobId, isEditing])
    const steps = [
        { number: 1, title: "Job Information", component: JobInformation },
        { number: 2, title: "Job Description", component: Jobdescription },
        { number: 3, title: "Perks & Benefits", component: PerksAndBenefits },
    ]
    const CurrentStepComponent = steps[currentStep - 1].component
    const handleNext = () => {
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
    const handleFinalSubmit = async () => {
        try {
            const requiredFields = [
                'jobTitle', 'employmentTypes', 'responsibilities', 'whoYouAre', 'industry'
            ]
            const missingFields = requiredFields.filter(field =>
                !formData[field] ||
                (Array.isArray(formData[field]) && formData[field].length === 0)
            )
            if (missingFields.length > 0) {
                toast.error("Please fill all the following fields")
                return
            }
            const response = isEditing ? await updateJob(jobId as string, {...formData,_id:jobId} as JobType) : await postjob(formData);
            if (response.status === 201) {
                toast.success("Job updated!")
                setTimeout(() => {
                    navigate('/joblistings')
                }, 2000)
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
                        onSubmit={handleFinalSubmit} />
                </div>
            </div>
        </div>
    )
}
