import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { PerksAndBenefits } from "./PerksAndBenefits"
import { JobInformation } from "./JobInformation"
import { Jobdescription } from "./JobDescription"

export const JobPostingForm = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        jobTitle: "",
        employmentTypes: [],
        salaryRange: { min: 5000, max: 22000 },
        categories: [],
        skills: [],
        responsibilities: '',
        whoYouAre: "",
        niceToHave: "",
        benefits: []
    })
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
                        onNext={handleNext} />
                </div>

            </div>
        </div>
    )
}
