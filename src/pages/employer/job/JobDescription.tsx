import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { JobDescriptionProps, jobFormData } from "../../../types/Employer";
import { RichTextEditor } from "./RichTextEditor";

const jobDescriptionSchema = z.object({
    description: z.string().min(1, "Job description is required"),
    responsibilities: z.string().min(1, "Responsibilities are required"),
    whoYouAre: z.string().min(1, "Who you are is required"),
    niceToHave: z.string().optional(),
});


export const Jobdescription = ({ formData, updateFormData, onNext }: JobDescriptionProps) => {
    const isEditing = !!formData.jobTitle;

    const { control, handleSubmit, formState: { errors } } = useForm<jobFormData>({
        resolver: zodResolver(jobDescriptionSchema),
        defaultValues: {
            description: formData.description || '',
            responsibilities: formData.responsibilities || '',
            whoYouAre: formData.whoYouAre || '',
            niceToHave: formData.niceToHave || '',
        }
    });

    const onSubmit = (data:jobFormData) => {
        updateFormData(data);
        onNext(); 
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
                <h2 className="text-xl mb-2">{isEditing ? "Edit" : "Add"} Job Description</h2>
                <p className="text-gray-400 text-sm mb-6">
                    {isEditing ? "Update the job description, responsibilities, and other details" : "Add the description of the jobs, responsibilities, who you are, and nice-to-haves."}
                </p>
                <div className="space-y-6">
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                label="Job Description"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={isEditing ? "Update the job description!" : "Enter the job description!"}
                            />
                        )}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                    <Controller
                        name="responsibilities"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                label="Responsibilities"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={isEditing ? "Update the responsibilities" : "Outline the core responsibilities of the position!"}
                            />
                        )}
                    />
                    {errors.responsibilities && <p className="text-red-500 text-sm">{errors.responsibilities.message}</p>}

                    <Controller
                        name="whoYouAre"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                label="Who You Are"
                                value={field.value}
                                onChange={field.onChange}
 placeholder={isEditing ? "Update the qualifications" : "Add your preferred candidates' qualifications!"}
                            />
                        )}
                    />
                    {errors.whoYouAre && <p className="text-red-500 text-sm">{errors.whoYouAre.message}</p>}

                    <Controller
                        name="niceToHave"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                label="Nice-To-Haves"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={isEditing ? "Update the nice-to-have" : "Add nice-to-have skills and qualifications!"}
                            />
                        )}
                    />
                    {errors.niceToHave && <p className="text-red-500 text-sm">{errors.niceToHave.message}</p>}
                </div>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Next step</button>
            </div>
        </form>
    );
};