import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Logo } from "../../components/Logo";
import { candidateDetails } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { fetchLanguageSuggestions, fetchLocationSuggestions } from "../../utils/LanguageAndLocation";
type LocationSuggestion = {
  name: string;
  id: number;
};
const CandidateDetails = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [languageSuggestions, setLanguagesSuggestion] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const formik = useFormik({
    initialValues: {
      experience: "",
      languages: [] as string[],
      location: "",
      aboutMe: "",
      education: {
        degree: "",
        year: "",
        institution: "",
      },
      dateofbirth: "",
      gender: "",
      skills: [] as string[],
      resumeFile: null
    },
    validationSchema: Yup.object({
      education: Yup.object({
        degree: Yup.string().required("Degree is required"),
        year: Yup.string()
          .required("Year is required")
          .matches(/^\d{4}$/, "Year must be a 4-digit number")
          .test(
            "is-past-year",
            "Graduation cannot be in the future",
            (value) => {
              const currentYear = new Date().getFullYear();
              return value ? parseInt(value) <= currentYear : false;
            }
          ),
        institution: Yup.string().required("Instituiton is required"),
      }),
      languages: Yup.array().of(Yup.string()).min(1, "Languages is required"),
      resumeFile: Yup.mixed()
        .nullable()
        .test('fileSize', "File too large!", (value) => {
          if (!value) return true
          return (value as File).size <= 500000000
        })
        .test('fileType', "Unsupported file type", (value) => {
          if (!value) return true
          return ['application/pdf', 'application/msword'].includes((value as File).type)

        }

        ),
      aboutMe: Yup.string().required("About me is required"),
      dateofbirth: Yup.date()
        .max(new Date(), "Date must be in the past")
        .required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
      skills: Yup.array()
        .of(Yup.string())
        .min(1, "At least one skill is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();


      if (profilePicture instanceof File) {
        console.log("Appending profile picture:", {
          name: profilePicture.name,
          type: profilePicture.type,
          size: profilePicture.size
        });
        formData.append("profilePicture", profilePicture);
      }
      if (resumeFile) {
        formData.append("resumeFile", resumeFile);
        console.log('resumefile appended')
      }
      formData.append("data", JSON.stringify(values));
      try {
        await candidateDetails(formData);
        toast.success("Form submitted");
      } catch (error) {
        toast.error("error occured in candidateDetails");
      }
      console.log("Submitted Values:", values);
      toast.success("Details submitted successfully!");
      navigate('/home')
    },
  });
  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.trim();
    setLanguageInput(query);
    if (query) {
      try {
        const languages=await fetchLanguageSuggestions(query)
        setLanguagesSuggestion(languages)
        
          

      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      setLanguagesSuggestion([]);
    }
  };
  const handleLocationChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.trim();
    setLocationInput(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query) {
        try {
          const locations=await fetchLocationSuggestions(query)
          setLocationSuggestions(locations)

          
        } catch (error) {
          console.error("Error fetching locations:", error);
          toast.error("Failed to fetch location suggestions!");
        }
      } else {
        setLocationSuggestions([]);
      }
    }, 500);
  };

  const handleLanguageSelect = (language: string) => {
    if (!formik.values.languages.includes(language)) {
      formik.setFieldValue("languages", [...formik.values.languages, language]);
    }

    setLanguagesSuggestion([]);
    setLanguageInput("");
  };
  const handleLocationSelect = (location: string) => {
    formik.setFieldValue("location", location);
    setLocationInput(location);
    setLocationSuggestions([]);
  };

  const removeLanguage = (language: string) => {
    const updatedLanguages = formik.values.languages.filter(
      (lang) => lang !== language
    );
    formik.setFieldValue("languages", updatedLanguages);
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setResumeFile(file);
      formik.setFieldValue("resumeFile", file)
    }
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log('selectedfile', file)
      if (file.type.startsWith("image/")) {
        setProfilePicture(file);
        setProfilePicturePreview(URL.createObjectURL(file));
      } else {
        toast.error("Please upload a valid image file!");
      }
    }
  };


  const addSkill = (newSkill: string): void => {
    if (newSkill.trim() && !formik.values.skills.includes(newSkill)) {
      formik.setFieldValue("skills", [...formik.values.skills, newSkill]);
    }
  };

  const removeSkill = (index: number): void => {
    const updatedSkills = formik.values.skills.filter((_, i) => i !== index);
    formik.setFieldValue("skills", updatedSkills);
  };

  return (
    <form
      className="min-h-screen bg-black text-white p-4"
      onSubmit={formik.handleSubmit}
    >
      <div className="text-center mb-8">
        <Logo width={150} height={40} />
      </div>
      <div className="max-w-4xl mx-auto bg-zinc-950 border border-purple-500/20 rounded-lg p-6 space-y-8">
        <h2 className="text-lg font-semibold mb-4">Candidate Details</h2>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Upload Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleProfileChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
          />
          {profilePicturePreview && (
            <div className="mt-4">
              <img
                src={profilePicturePreview}
                alt="profile-picture"
                className="w-32 h-32 rounded-full object-cover mx-auto border border-zinc-800"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Experience</label>
          <input
            type="text"
            name="experience"
            value={formik.values.experience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-zinc-900 border ${formik.touched.experience && formik.errors.experience
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.experience && formik.errors.experience && (
            <p className="text-red-500 text-sm">{formik.errors.experience}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Resume</label>
          <input
            type="file"
            name="resumeFile"
            onChange={handleResumeChange}
            accept='.pdf,.doc,.docx'
            onBlur={formik.handleBlur}
            className={`w-full bg-zinc-900 border ${formik.touched.resumeFile && formik.errors.resumeFile
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.resumeFile && formik.errors.resumeFile && (
            <p className="text-red-500 text-sm">{formik.errors.resumeFile}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Skills</label>
          <input
            type="text"
            ref={inputRef}
            name="newSkill"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const newSkill = e.currentTarget.value.trim();
                if (newSkill) {
                  addSkill(newSkill);
                  e.currentTarget.value = "";
                }
              }
            }}
            className="flex-grow bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
          />
          <button
            type="button"
            onClick={() => {
              if (inputRef.current && inputRef.current.value.trim()) {
                addSkill(inputRef.current.value.trim());
                inputRef.current.value = "";
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 space-y-2">
          {formik.values.skills.map((skill, index) => (
            <li
              key={index}
              className="bg-zinc-900 flex justify-between items-center px-3 py-2 rounded text-white"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        {formik.touched.skills && formik.errors.skills && (
          <p className="text-red-500 text-sm">{formik.errors.skills}</p>
        )}

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Languages</label>
          <input
            type="text"
            name="languages"
            value={languageInput}
            onChange={handleLanguageChange}
            className={`w-full bg-zinc-900 border ${formik.touched.languages && formik.errors.languages
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.languages && formik.errors.languages && (
            <p className="text-red-500 text-sm">{formik.errors.languages}</p>
          )}
          {languageSuggestions.length > 0 && (
            <ul className="bg-zinc-900 border border-zinc-800 rounded mt-2">
              {languageSuggestions.map((lang, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2">
            {formik.values.languages.map((language, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-purple-600 text-white rounded-full px-3 py-1 m-1"
              >
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(language)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={locationInput}
            onChange={handleLocationChange}
            className={`w-full bg-zinc-900 border ${formik.touched.location && formik.errors.location
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-red-500 text-sm">{formik.errors.location}</p>
          )}
          {locationSuggestions.length > 0 && (
            <ul className="bg-zinc-900 border border-zinc-800 rounded mt-2">
              {locationSuggestions.map((loc, index) => (
                <li
                  key={loc.id}
                  className="p-2 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => handleLocationSelect(loc.name)}
                >
                  {loc.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateofbirth"
            value={formik.values.dateofbirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-zinc-900 border ${formik.touched.dateofbirth && formik.errors.dateofbirth
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.dateofbirth && formik.errors.dateofbirth && (
            <p className="text-red-500 text-sm">{formik.errors.dateofbirth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">About Me</label>
          <input
            type="text"
            name="aboutMe"
            value={formik.values.aboutMe}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-zinc-900 border ${formik.touched.aboutMe && formik.errors.aboutMe
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.aboutMe && formik.errors.aboutMe && (
            <p className="text-red-500 text-sm">{formik.errors.aboutMe}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Gender</label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-zinc-900 border ${formik.touched.gender && formik.errors.gender
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-sm">{formik.errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Degree</label>
          <input
            type="text"
            name="education.degree"
            value={formik.values.education.degree}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-zinc-900 border ${formik.touched.education?.degree && formik.errors.education?.degree
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.education?.degree &&
            formik.errors.education?.degree && (
              <p className="text-red-500 text-sm">
                {formik.errors.education?.degree}
              </p>
            )}
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Graduation Year
          </label>
          <input
            type="text"
            name="education.year"
            value={formik.values.education.year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="YYYY"
            maxLength={4}
            className={`w-full bg-zinc-900 border ${formik.touched.education?.year && formik.errors.education?.year
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.education?.year && formik.errors.education?.year && (
            <p className="text-red-500 text-sm">
              {formik.errors.education?.year}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Institution
          </label>
          <input
            type="text"
            name="education.institution"
            value={formik.values.education.institution}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="University"
            className={`w-full bg-zinc-900 border ${formik.touched.education?.institution && formik.errors.education?.institution
              ? "border-red-500"
              : "border-zinc-800"
              } rounded px-3 py-2 text-white`}
          />
          {formik.touched.education?.institution &&
            formik.errors.education?.institution && (
              <p className="text-red-500 text-sm">
                {formik.errors.education?.institution}
              </p>
            )}
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CandidateDetails;