import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../utils/Spinner";
import {
  fetchLanguageSuggestions,
  fetchLocationSuggestions,
} from "../../utils/LanguageAndLocation";
import { candidateDetails } from "../../services/authService";
import { toast } from 'react-hot-toast'
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../../utils/Navbar";
import { UserCandidate } from "../../types/Candidate";
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Firstname must be at least 1 characters" }),
  secondName: z
    .string()
    .min(1, { message: "Secondname must be at least 1 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Enter a valid phone number" }),
  location: z.string().min(1, { message: "Location is required" }),
  dateOfBirth: z
    .string()
    .refine((val) => dateRegex.test(val), {
      message: "Date must be in the  YYYY-MM-DD format",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return (
          date instanceof Date && !isNaN(date.getTime()) && date <= new Date()
        );
      },
      {
        message: "Date must be in the past",
      }
    ),
  aboutMe: z.string().min(1, { message: "About Me is required" }).max(500, { message: "Enter the field correctly!" }),
  skills: z.array(z.string())  
    .min(1, { message: "At least one skill is required" })
    .refine((skills) => skills.every(skill => skill.length <= 30), {
      message: "Skills must be 30 characters or less"
    })
    .refine((skills) => new Set(skills).size === skills.length, {
      message: "No duplicate skills allowed"
    })
    .refine((skills) => skills.length <= 10, {
      message: "Maximum 10 skills allowed"
    }),
  languages: z.string()
    .min(1, { message: "At least one language required" }),
  resume: z.array(z.string()).min(1, { message: "At least one resume is required" }),
  experience: z.string()
    .min(1, "Experience is required")
});
type FormData = z.infer<typeof formSchema>;
const EditProfile = () => {
  const user=useSelector((state:{user:UserCandidate})=>state.user)
  const navigate = useNavigate()
  const [languageSuggestions, setLanguageSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<
    { name: string; id: number }[]
  >([]);
  const [languageInput, setLanguageInput] = useState<string>(
    user.languages ? user.languages.join(", ") : ""
  );
  const [locationInput, setLocationInput] = useState<string>(user.location||'');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [resume, setResume] = useState<string[]>(Array.isArray(user.resume)?user.resume:[]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch()
  const [existingSkills, setExistingSkills] = useState<string[]>([]);
  const [existingLanguages, setExisitingLanguages] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>("");
  useEffect(() => {
    if (user) {
      setExistingSkills(user.skills || []);
      setExisitingLanguages(user.languages || []);
    }
  }, [setExistingSkills, setExisitingLanguages]);
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const cleanValue = value.trim().toLowerCase();
    const yearPattern = /^(\d+)\s*(year|years|yr|yrs)?$/;
    const monthPattern = /^(\d+)\s*(month|months|mo|mos)?$/;
    if (cleanValue === '') {
      setExperience('');
      setError("experience", { message: "" });
      return;
    }
    const yearMatch = cleanValue.match(yearPattern);
    const monthMatch = cleanValue.match(monthPattern);
    if (yearMatch) {
      const years = parseInt(yearMatch[1], 10);
      if (years < 0 || years > 50) {
        setError("experience", {
          message: "Experience must be between 0 and 50 years",
        });
        return;
      }
      setExperience(`${years} ${years === 1 ? 'year' : 'years'}`);
      setError("experience", { message: "" });
    } else if (monthMatch) {
      const months = parseInt(monthMatch[1], 10);
      if (months < 0 || months > 600) { 
        setError("experience", {
          message: "Experience must be between 0 and 600 months",
        });
        return;
      }
      setExperience(`${months} ${months === 1 ? 'month' : 'months'}`);
      setError("experience", { message: "" });
    } else {
      setError("experience", {
        message: "Please enter valid format (e.g., '2 years' or '6 months')",
      });
    }
  };
  

  type FormFieldKeys = keyof FormData;
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 100 * 1024 * 1024;
      if (!validTypes.includes(file.type)) {
        setError("profilePicture" as FormFieldKeys, {
          message: "unsupported file type",
        });
        return;
      }
      if (file.size > maxSize) {
        setError("profilePicture" as FormFieldKeys, {
          message: "File size is too large",
        });
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newResumes = Array.from(files).reduce((acc, file) => {
        if (
          ![
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type)
        ) {
          setError("resume", { message: "file not supported" });
          return acc;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError("resume", { message: "File too large" });
          return acc;
        }
        if (acc.length >= 3) {
          setError("resume", {
            message: "You reached the maximum size of resume",
          });
          return acc;
        }
        if (acc.includes(file.name)) {
          setError("resume", { message: "the file already exists!" });
        }
        acc.push(file.name);
        return acc;
      }, [] as string[]);
      if (newResumes.length > 0) {
        setResume((prevResumes) => [...prevResumes, ...newResumes]);
        clearErrors('resume')
      }
      if (resumeInputRef.current) {
        resumeInputRef.current;
      }
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName || "",
      secondName: user.secondName || "",
      email: user.email || "",
      phoneNumber: user.phonenumber?.toString() || "",  
      location: user.location || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      aboutMe: user.aboutMe || "",
      skills: user.skills || [],  
      languages: user.languages?user.languages.join(', '):'',
      experience: user.experience || "",
      resume: Array.isArray(user.resume)?user.resume:[]
    },
  });
  useEffect(() => {
    setValue("location", locationInput);
  }, [locationInput, setValue]);
  useEffect(() => {
    if (user.languages) {
      setExisitingLanguages(user.languages)
      setLanguageInput(user.languages.join(', '))
      setValue('languages', user.languages.join(', '))
    }
  }, [user.languages])
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const allSkills = [
      ...new Set([
        ...existingSkills,
        ...skills
      ].map(skill => skill.toLowerCase()))
    ];
  
    if (allSkills.length === 0) {
      setError("skills", {
        type: 'manual',
        message: "Please provide at least one skill"
      });
      setIsSubmitting(false);
      return;
    }
    if (existingLanguages.length == 0) {
      setError('languages', { type: 'manual', message: "language is required!" })
      return
    }
    const formData = new FormData();
    let profilePictureURL = user.profilePicture
    if (profilePicture instanceof File) {
      formData.append("profilePicture", profilePicture);
      profilePictureURL = URL.createObjectURL(profilePicture)
    }
    resume.forEach((file) => {
      formData.append("resume", file);
    });
    if (resume.length === 0) {
      setError('resume', { type: 'manual', message: "Please upload atleast one  resume" })
      setIsSubmitting(false)
      return
    }
    formData.append(
      "data",
      JSON.stringify({
        experience: data.experience,
        languages: existingLanguages.join(', '),
        location: data.location,
        aboutMe: data.aboutMe,
        dateOfbirth: data.dateOfBirth,
        skills: allSkills,
        profilePicture:profilePictureURL
      })
    );
    try {
      const response = await candidateDetails(formData);
      if (response.message == "User updated successfully!") {
        dispatch(setUser({
          userName: data.firstName + '' + data.secondName,
          email: data.email,
          profilePicture: profilePictureURL,
          location: data.location,
          experience: data.experience,
          aboutMe: data.aboutMe,
          skills: data.skills,
          resume: response.updatedUser.resume,
          languages: data.languages
        }))
        const timeOutId = setTimeout(() => {
          navigate('/candidate-profile')
          setIsSubmitting(false)
        }, 3000)
        toast.success(response.message || "Details updated successfully!");
        return () => clearTimeout(timeOutId);
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error('error occured')
    }
  };
  useEffect(()=>{
    if(profilePicture)
    {
      const reader=new FileReader()
      reader.onloadend=()=>{
        setProfilePicturePreview(reader.result as string)
      }
      reader.readAsDataURL(profilePicture)
    }
    else
    {
      setProfilePicturePreview(user.profilePicture||null)
    }
  },[profilePicture,user.profilePicture])
  const handleLocationInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    const value: string = e.target.value;
    setLanguageInput(value)
    if (value.trim()) {
      const suggestions = await fetchLanguageSuggestions(value);
      const filteredSuggestions = suggestions.filter(
        suggestion => !existingLanguages.includes(suggestion) && suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setLanguageSuggestions(filteredSuggestions)
    } else {
      setLanguageSuggestions([]);
    }
  };
  const removeResume = (index: number) => {
    const updatedResume = resume.filter((_, i) => i !== index);
    setResume(updatedResume);
    if (updatedResume.length === 0) {
      setError('resume', { type: 'manual', message: "Alt least one resume is required" })
      return
    }
    else {
      clearErrors('resume')
    }
  };
  const selectLanguageSuggestion = (suggestion: string) => {
    if(!existingLanguages.includes(suggestion))
    {
      setExisitingLanguages((prev)=>[...prev,suggestion])
    }
    setLanguageInput(suggestion)
    setValue('languages', [...existingLanguages,suggestion].join(', '))
    setLanguageSuggestions([]);
    clearErrors("languages");
  };
  const selectLocationSuggestion = (suggestion: {
    name: string;
    id: number;
  }) => {
    setLocationInput(suggestion.name);
    setValue("location", suggestion.name);
    setLocationSuggestions([]);
  };
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const today = new Date();
    const inputDate = new Date(value);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      setError("experience", { message: "experience not valid" });
      return;
    }
    if (inputDate >= today) {
      setError("experience", {
        message: "experience must be in 0 to 50 years",
      });
      return;
    }
    const minAgeDate = new Date()
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 16)
    if (inputDate > minAgeDate) {
      setError('dateOfBirth', { type: 'manual', message: "You must be atleast 18 years old!" })
      return
    }
    setError('dateOfBirth', { message: "" })
  };
  const addSkill = (newSkill: string): void => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill === "") {
      setError("skills", { type: "manual", message: "Skill cannot be empty" });
      return;
    }
    const getCurrentSkills = () => {
      const allCurrentSkill = [
        ...existingSkills.map(skill => skill.toLowerCase()),
        ...skills.map(skill => skill.toLowerCase())
      ]
      return allCurrentSkill
    }
    const isDuplicate = getCurrentSkills().includes(trimmedSkill.toLowerCase())
    if (isDuplicate) {
      setError('skills', { message: "Skill already exists" });
      return;
    }
    if (trimmedSkill.length > 30) {
      setError('skills', { message: "Skill too large" });
      return;
    }
    const totalSkillCount = existingSkills.length + skills.length
    if (totalSkillCount >= 10) {
      setError('skills', { type: "manual", message: "Too many skills" });
      return;
    }
    if (existingSkills.length <= 10) {
      setExistingSkills(prev => [...prev, trimmedSkill])
    }
    else {
      setSkills(prev => [...prev, trimmedSkill])
    }
  };
  const removeSkill = (skillToRemove: string, isExisting: boolean) => {
    const matchSkill = (skill: string) =>
      skill.toLowerCase() === skillToRemove.toLowerCase();
    if (isExisting) {
      const updatedExistingSkills = existingSkills.filter(
        (skill) => !matchSkill(skill)
      );
      const updatedSkills = skills.filter((skill) => !matchSkill(skill));
      setExistingSkills(updatedExistingSkills);
      setSkills(updatedSkills);
      if (updatedExistingSkills.length === 0 && updatedSkills.length === 0) {
        setError('skills', {
          type: 'manual',
          message: "At least one skill is required"
        });
      } else {
        clearErrors('skills');
      }
    } else {
      const updatedSkills = skills.filter((skill) => !matchSkill(skill));
      const updatedExistingSkills = existingSkills.filter(
        (skill) => !matchSkill(skill)
      );
      setSkills(updatedSkills);
      setExistingSkills(updatedExistingSkills);
      if (updatedSkills.length === 0 && updatedExistingSkills.length === 0) {
        setError('skills', {
          type: 'manual',
          message: "At least one skill is required"
        });
      } else {
        clearErrors('skills');
      }
    }
  };
  const removeLanguage = (languageToRemove: string) => {
    setExisitingLanguages(existingLanguages.filter(lang => lang !== languageToRemove))
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="relative h-[350px]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-black opacity-90"></div>
        <div className="flex flex-col items-center mb-4">
          <div className="h-48 w-48 rounded-full border-4 border-black overflow-hidden -mt-20 mb -4 ml-10"></div>
        </div>
      </div>
      <div className="bg-black text-white pt-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="relative inline-block h-48 w-48 rounded-full overflow-hidden border-4 border-black bg-gray-900 -mt-48 l-auto">
              <img
                src={profilePicturePreview || user.profilePicture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black bg-opacity text-white flex items-center justify-center opacity-0 hover:opacity-100 transititon-opacity"
              >
                Change Picture
              </button>
            </div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
          </div> 
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  id="firstName"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                />
                {errors.firstName &&
                  typeof errors.firstName.message === "string" && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor="secondName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Second Name
                </label>
                <input
                  {...register("secondName")}
                  id="secondName"
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                />
                {errors.secondName &&
                  typeof errors.secondName.message === "string" && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.secondName.message}
                    </p>
                  )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.email && typeof errors.email.message === "string" && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-300"
              >
                Phone Number
              </label>
              <input
                value={user.phonenumber}
                {...register("phoneNumber")}
                id="phoneNumber"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.phoneNumber &&
                typeof errors.phoneNumber.message === "string" && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-300"
              >
                Location
              </label>
              <input
                {...register("location")}
                id="location"
                value={locationInput}
                onChange={handleLocationInputChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1">
                  {locationSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => selectLocationSuggestion(suggestion)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                    >
                      {suggestion.name}
                    </div>
                  ))}
                </div>
              )}
              {errors.location &&
                typeof errors.location.message === "string" && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-300"
              >
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                id="dateOfBirth"
                type="date"
                onChange={handleDobChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="aboutMe"
                className="block text-sm font-medium text-gray-300"
              >
                About
              </label>
              <textarea
                {...register("aboutMe")}
                id="aboutMe"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.aboutMe && typeof errors.aboutMe.message === "string" && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.aboutMe.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Skills
              </label>
              <div className="flex flex-wrap mt-2">
                {existingSkills.map((skill, index) => (
                  <div
                    key={`existing-${index}`}
                    className="flex items-center bg-purple-700 text-white rounded-full px-2 py-1 mr-2 mb-2"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill, true)} className="ml-2 text-white hover:text-red-300">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a skill"
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const newSkill = (
                      e.target as HTMLInputElement
                    ).value.trim();
                    addSkill(newSkill);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              {errors.skills && typeof errors.skills.message === "string" && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.skills.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Resume
              </label>
              <div className="flex flex-wrap mt-2">
                {resume.map((file: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center bg-purple-700 text-white rounded-full px-2 py-1 mr-2 mb-2"
                  >
                    {file.split("\\").pop()}
                    <button
                      onClick={() => removeResume(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                placeholder="Add a resume"
                ref={resumeInputRef}
                onChange={handleResumeChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
                accept=".pdf,.doc,.docx"
                multiple
              />
              {errors.resume && typeof errors.resume.message === "string" && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.resume.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Languages
              </label>
              <div className="flex flex-wrap mt-2">
                {existingLanguages.map((language, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-purple-700 text-white rounded-full px-2 py-1 mr-2 mb-2"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                {...register("languages")}
                id="languages"
                value={languageInput}
                onChange={(e) => {
                  setLanguageInput(e.target.value);
                  handleLanguageInputChange(e);
                }}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {languageSuggestions.length > 0 && (
                <div className="absolute-z10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1">
                  {languageSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                      onClick={() => selectLanguageSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              {errors.languages &&
                typeof errors.languages.message === "string" && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.languages.message}
                  </p>
                )}
            </div>
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-300"
              >
                Experience
              </label>
              <input
                {...register("experience")}
                id="experience"
                value={experience}
                onChange={handleExperienceChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-lg px-4 py-3"
              />
              {errors.experience &&
                typeof errors.experience.message === "string" && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
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
