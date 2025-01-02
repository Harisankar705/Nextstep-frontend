import { useState } from "react";
import { JobInformationProps } from "../../../types/Employer";
import { X } from "lucide-react";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';

const employmentTypes = [
    "Full-Time",
    "Part-Time",
    "Remote",
    "Internship",
    "Contract",
];

const jobFormSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    employmentTypes: z.array(z.string()).min(1, "Select at least one employment type"),
    salaryRange: z.object({
        min: z.number().min(0, "Minimum salary must be positive"),
        max: z.number().min(0, "Maximum salary must be positive")
    }),
    skills: z.array(z.string()),
    description: z.string().min(1, "Job description is required"),
    responsibilities: z.string().min(1, "Responsibilities are required!"),
    whoYouAre: z.string(),
    niceToHave: z.string(),
    benefits: z.array(z.string())
});

type JobFormData = z.infer<typeof jobFormSchema>;

export const JobInformation = ({
    formData,
    updateFormData,
    onNext,
}: JobInformationProps) => {
    const [newSkill, setNewSkill] = useState("");

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<JobFormData>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: formData
    });

    const onSubmit = (data: JobFormData) => {
        updateFormData(data);
        onNext();
    };

    const handleEmploymentTypeChange = (type: string) => {
        const currentTypes = watch('employmentTypes') || [];
        const updated = currentTypes.includes(type)
            ? currentTypes.filter((t: string) => t !== type)
            : [...currentTypes, type];
        setValue('employmentTypes', updated);
    };

    const handleAddSkill = () => {
        if (newSkill && !watch('skills').includes(newSkill)) {
            const updatedSkills = [...watch('skills'), newSkill];
            setValue('skills', updatedSkills);
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        const updatedSkills = watch('skills').filter((s: string) => s !== skill);
        setValue('skills', updatedSkills);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
                <h2 className="text-xl mb-2">Basic Information</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This information will be displayed publicly!
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm mb-2">Job Title</label>
                        <Controller
                            name="jobTitle"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Your job title"
                                    className="w-full bg-transparent border border-gray-800 rounded p-2 text-white"
                                />
                            )}
                        />
                        {errors.jobTitle && (
                            <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Type of Employment</label>
                        <p className="text-gray-400 text-sm mb-2">
                            You can select multiple types of employment
                        </p>
                        <div className="space-y-2">
                            {employmentTypes.map((type) => (
                                <label key={type} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={watch('employmentTypes')?.includes(type)}
                                        onChange={() => handleEmploymentTypeChange(type)}
                                        className="rounded border-gray-800"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                        {errors.employmentTypes && (
                            <p className="text-red-500 text-sm mt-1">{errors.employmentTypes.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Salary</label>
                        <p className="text-gray-400 text-sm mb-2">
                            Please specify the estimated salary range for this role.
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <span className="mr-2">₹</span>
                                <Controller
                                    name="salaryRange.min"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            className="w-24 bg-transparent border border-gray-800 rounded p-2"
                                        />
                                    )}
                                />
                            </div>
                            <span>to</span>
                            <div className="flex items-center">
                                <span className="mr-2">₹</span>
                                <Controller
                                    name="salaryRange.max"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            className="w-24 bg-transparent border border-gray-800 rounded p-2"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {(errors.salaryRange?.min || errors.salaryRange?.max) && (
                            <p className="text-red-500 text-sm mt-1">Please enter valid salary range</p>
                        )}
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
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
                            />
                                Add Skills
                            <div className="flex flex-wrap gap-2">
                                {watch('skills').map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center bg-white/10 rounded px-2 py-1"
                                    >
                                        {skill}
                                        <button
                                            type="button"
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
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
                    >
                        Next Step
                    </button>
                </div>
                </div>
        </form>
    );
};
