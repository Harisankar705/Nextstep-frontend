import { Heart, Laptop, Waves, X, LucideProps } from "lucide-react"
import { Benefit, IconType } from "../../../types/Employer"
import { PerksAndBenefitsProps } from "../../../types/Candidate"
const defaultBenefits: Benefit[] = [
    {
        id: '1',
        icon: 'heart',
        title: "Full Healthcare",
        description: "We believe in thriving communities and that starts with our team being happy and healthy!"
    },
    {
        id: '2',
        icon: 'waves',
        title: "Vacation and Company Sponsored Trips",
        description: 'We believe you should have a flexible schedule that makes space for family, wellness, and fun.'
    },
    {
        id: '3',
        icon: 'laptop',
        title: "Remote Work Options",
        description: "We believe in thriving communities and that starts with our team being happy and healthy!"
    }
]
const IconMap: Record<IconType, React.ComponentType<LucideProps>> = {
    heart: Heart,
    waves: Waves,
    laptop: Laptop
}
export const PerksAndBenefits = ({ formData, updateFormData, onNext,onSubmit }: PerksAndBenefitsProps) => {
    const addBenefit = (benefit: Benefit) => {
        updateFormData({
            benefits: [...formData.benefits, benefit]
        })
    }
    const removeBenefit = (id: string) => {
        updateFormData({
            benefits: formData.benefits.filter((benefit: Benefit) => benefit.id !== id)
        })
    }
    const BenefitCard = ({ benefit }: { benefit: Benefit }) => {
        const Icon = IconMap[benefit.icon]
        const isSelected = formData.benefits.some(b => b.id === benefit.id)
        return (
            <div
                className={`relative p-4 ${isSelected ? 'bg-gray-900/50' : "bg-gray-800/30"} rounded-lg border border-gray-800 transition-colors`}
            >
                {isSelected && (
                    <button
                        onClick={() => removeBenefit(benefit.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-white"
                        aria-label={`Remove ${benefit.title} benefit`}
                    >
                        <X size={16} />
                    </button>
                )}
                <div className="mb-3">
                    <Icon size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
                {!isSelected && (
                    <button
                        onClick={() => addBenefit(benefit)}
                        className="mt-3 w-full px-2 py-1 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                        Add Benefit
                    </button>
                )}
            </div>
        )
    }
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl mb-2">Perks and Benefits</h2>
                <p className="text-gray-400 text-sm mb-4">
                    Select the perks and benefits that come with this position
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {defaultBenefits.map((benefit) => (
                        <BenefitCard key={benefit.id} benefit={benefit} />
                    ))}
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onSubmit}
                    className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
                >
                    Post Job
                </button>
            </div>
        </div>
    )
}
export default PerksAndBenefits