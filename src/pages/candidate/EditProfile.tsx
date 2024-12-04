import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../utils/Spinner";
import { fetchLanguageSuggestions, fetchLocationSuggestions } from "../../utils/LanguageAndLocation";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Firstname must be at least 2 characters" }),
  secondName: z.string().min(2, { message: "Secondname must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Enter a valid phone number" }),
  location: z.string().min(1, { message: "Location is required" }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please enter a valid date" }),
  aboutMe: z.string().max(500, { message: "Enter the field correctly!" }),
  skills: z.string().transform((val) => val.split(",").map((skill) => skill.trim())),
  languages: z.string().transform((val) => val.split(",").map((lang) => lang.trim())),
  experience: z.string(),
});
type FormData = z.infer<typeof formSchema>
type selectedLanguageSuggestionProps = {
  languageInput: string | null,
  setLanguageInput: (input: string) => void
  setValue: (field: string, value: string) => void
  setLanguageSuggestions: (suggestions: string[]) => void
}
const EditProfile = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [languageSuggestions, setLanguageSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<{ name: string, id: number }[]>([]);
  const [languageInput, setLanguageInput] = useState<string[]>(user.languages);
  const [locationInput, setLocationInput] = useState<string>(user.location);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>(user.skills || [])
  const [languages, setLanguages] = useState<string[]>(user.languages || [])

  const profilePictureURL = `http://localhost:4000/uploads/profile-pictures/${user.profilePicture.split('\\').pop()}`;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName || "",
      secondName: user.secondName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      location: user.location || "",
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
      aboutMe: user.aboutMe || "",
      skills: user.skills ? user.skills.join(", ") : "",
      languages: user.languages ? user.languages.join(", ") : "",
      experience: user.experience || "",
    },
  });
  useEffect(() => {
    setValue('location', locationInput)
    setValue('languages', languageInput)
  }, [locationInput, languageInput, setValue])

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    dispatch({ type: "UPDATE_USER", payload: values });
    setIsSubmitting(false);
  };

  const handleLocationInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    if (value.trim()) {
      const suggestions = await fetchLocationSuggestions(value);
      setLocationSuggestions(suggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLanguageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLanguageInput(value.split(',').map(lang => lang.trim()));
    if (value.trim()) {
      const suggestions = await fetchLanguageSuggestions(value);
      setLanguageSuggestions(suggestions);
    } else {
      setLanguageSuggestions([]);
    }
  };

  const selectLanguageSuggestion = (suggestion: string) => {
    const updatedLanguages = [suggestion];

    setLanguageInput(updatedLanguages);
    setValue('languages', updatedLanguages.join(','));
    setLanguageSuggestions([]);
  };

  const selectLocationSuggestion = (suggestion: { name: string; id: number }) => {
    setLocationInput(suggestion.name);
    setValue('location', suggestion.name);
    setLocationSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-[350px]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-black opacity-90"></div>
        <div className="flex flex-col items-center mb-4">
          <div className="h-48 w-48 rounded-full border-4 border-black overflow-hidden -mt-20 mb -4 ml-10">
          </div>
        </div>
      </div>

      <div className="bg-black text-white pt-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First Name</label>
                <input
                  {...register("firstName")}
                  id="firstName"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                />
                {errors.firstName && typeof errors.firstName.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>}
              </div>

              <div>
                <label htmlFor="secondName" className="block text-sm font-medium text-gray-300">Second Name</label>
                <input
                  {...register("secondName")}
                  id="secondName"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                />
                {errors.secondName && typeof errors.secondName.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.secondName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                {...register("email")}
                id="email"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.email && typeof errors.email.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">Phone Number</label>
              <input
                {...register("phoneNumber")}
                id="phoneNumber"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.phoneNumber && typeof errors.phoneNumber.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
              <input
                {...register("location")}
                id="location"
                value={locationInput}
                onChange={handleLocationInputChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {locationSuggestions.length > 0 && (
                <div className='absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1'>
                  {locationSuggestions.map((suggestion) => (
                    <div key={suggestion.id} onClick={() => selectLocationSuggestion(suggestion)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer">{suggestion.name}
                    </div>
                  ))}
                </div>
              )}
              {errors.location && typeof errors.location.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.location.message}</p>}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">Date of Birth</label>
              <input
                {...register("dateOfBirth")}
                id="dateOfBirth"
                type="date"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.dateOfBirth && <p className="mt-2 text-sm text-red-500">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-300">About</label>
              <textarea
                {...register("aboutMe")}
                id="aboutMe"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.aboutMe && typeof errors.aboutMe.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.aboutMe.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Skills</label>
              <div className="flex flex-wrap mt-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center bg-gray-700 text-white rounded-full px-2 py-1 mr-2 mb-2">
                    {skill}
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times; {/* Close button */}
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a skill"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newSkill = (e.target as HTMLInputElement).value.trim();
                    if (newSkill && !skills.includes(newSkill)) {
                      setSkills([...skills, newSkill]);
                      (e.target as HTMLInputElement).value = ''; // Clear input
                    }
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Languages</label>
              <div className="flex flex-wrap mt-2">
                {languages.map((language, index) => (
                  <div key={index} className="flex items-center bg-gray-700 text-white rounded-full px-2 py-1 mr-2 mb-2">
                    {language}
                    <button
                      onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times; {/* Close button */}
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a language"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newLanguage = (e.target as HTMLInputElement).value.trim();
                    if (newLanguage && !languages.includes(newLanguage)) {
                      setLanguages([...languages, newLanguage]);
                      (e.target as HTMLInputElement).value = ''; // Clear input
                    }
                  }
                }}
              />
            </div>






            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-300">Experience</label>
              <input
                {...register("experience")}
                id="experience"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.experience && typeof errors.experience.message === 'string' && <p className="mt-2 text-sm text-red-500">{errors.experience.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isSubmitting ? <Spinner loading={true} /> : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;