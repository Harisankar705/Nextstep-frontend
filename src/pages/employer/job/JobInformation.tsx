import { useState } from "react";
import { JobInformationProps } from "../../../types/Employer";
import { X } from "lucide-react";

const employmentTypes = [
    "Full-Time",
    "Part-Time",
    "Remote",
    "Internship",
    "Contract",
];
export const JobInformation = ({
    formData,
    updateFormData,
    onNext,
}: JobInformationProps) => {
    const [newSkill, setNewSkill] = useState("");
    const handleEmploymentTypeChange = (type: string) => {
        const current = formData.employmentTypes || [];
        const updated = current.includes(type)
            ? current.filter((t: string) => t !== type)
            : [...current, type];
        updateFormData({ employmentTypes: updated });
    };
    const handleAddSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            updateFormData({ skills: [...formData.skills, newSkill] });
            setNewSkill("");
        }
    };
    const removeSkill = (skill: string) => {
        updateFormData({
            skills: formData.skills.filter((s: string) => s !== skill),
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl mb-2">Basic Information</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This information will be displayed publically!
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm mb-2">Job Title</label>
                        <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => updateFormData({ jobTitle: e.target.value })}
                            placeholder="your job title"
                            className="w-full bg-transparent border border-gray-800 rounded p-2 text-white"
                        />
                        <p className="text-gray-500 text-sx mt-1">At least 80 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Type of Employment</label>
                        <p className="text-gray-400 text-sm mb-2">
                            You can select multiple type of employment
                        </p>
                        <div className="space-y-2">
                            {employmentTypes.map((type) => (
                                <label key={type} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.employmentTypes?.includes(type)}
                                        onChange={() => handleEmploymentTypeChange(type)}
                                        className="rounded border-gray-800"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Salary</label>
                        <p className="text-gray-400 text-sm mb-2">
                            Please specify the estimated salary range for this role.*You can
                            leave this blank!
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <span className="mr-2">₹</span>
                                <input
                                    type="number"
                                    value={formData.salaryRange.min}
                                    onChange={(e) =>
                                        updateFormData({
                                            salaryRange: {
                                                ...formData.salaryRange,
                                                min: Number(e.target.value),
                                            },
                                        })
                                    }
                                    className="w-24 bg-transparent border border-gray-800 rounded p-2"
                                />
                            </div>
                            <span>to</span>
                            <div className="flex items-center">
                                <span className="mr-2">₹</span>
                                <input
                                    type="number"
                                    value={formData.salaryRange.max}
                                    onChange={(e) =>
                                        updateFormData({
                                            salaryRange: {
                                                ...formData.salaryRange,
                                                max: Number(e.target.value),
                                            },
                                        })
                                    }
                                    className="w-24 bg-transparent border border-gray-800 rounded p-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Required Skills</label>
                        <div className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add required skills for the job"
                                className="flex-1 bg-transparent border border-gray-800 rounded p-2"
                            />
                            <button
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
                            >
                                Add skills
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill: string) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center bg-white/10 rounded px-2 py-1"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 text-gray-400 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={onNext} className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Next step</button>
            </div>
        </div>
    );
};
