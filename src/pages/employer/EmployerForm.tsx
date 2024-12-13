import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from 'yup'
import { fetchLocationSuggestions } from "../../utils/LanguageAndLocation";
import { LocationSuggestion } from "../../types/Candidate";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CompanyFormProps {
  initialData?: {
    companyName: string;
    website: string,
    location: string,
    employees: string,
    industry: string,
    description: string;
    logo: string | null,
    dateFounded: string | null
  }
  onSubmit: (formData: FormData) => Promise<void>
  buttonText?: string
}
const EmployerForm = ({ initialData, onSubmit,}: CompanyFormProps) => {
  const [logo, setLogo] = useState<string | null>("");

  const [locationInput, setLocationInput] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('logo', file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return '';  
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toISOString().split("T")[0]; 
  };

  const formik = useFormik({
    initialValues: {
      companyName: initialData?.companyName || '',
      website: initialData?.website || "",
      location: initialData?.location || '',
      employees: initialData?.employees || '',
      industry: initialData?.industry || "",
      dateFounded: formatDate(initialData?.dateFounded) || '',
      description: initialData?.description || '',
      logo: initialData?.logo || null

    },
    validationSchema: Yup.object({
      logo: Yup.mixed()
        .required("Company logo is required")
        .test(
          "fileType",
          "Unsupported file format. Only images are allowed.",
          (value) => {
            if (typeof value === 'string' || value === null) return true
            return value instanceof File && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          }
        ),
      companyName: Yup.string().required("Company name is required"),
      website: Yup.string()
        .url("Invalid URL format")
        .required("Website is required"),
      location: Yup.string().required("Location is required"),
      employees: Yup.string().required("Number of employees is required"),
      industry: Yup.string().required("Industry is required"),
      dateFounded: Yup.date().required("Date founded is required"),
      description: Yup.string()
        .max(500, "Maximum 500 characters allowed")
        .required("Description is required"),
    }),

    onSubmit: async (value) => {
      const formData = new FormData()
      if (logo) {
        formData.append('logo', logo)
      }
      formData.append('companyName', value.companyName);
      formData.append('website', value.website);
      formData.append('location', value.location);
      formData.append('employees', value.employees);
      formData.append('industry', value.industry);
      formData.append('dateFounded', value.dateFounded);
      formData.append('description', value.description);


      try {
        const response = await onSubmit(formData)
        toast.success("Company details submitted!")
        formik.resetForm()
        return response

      } catch (error) {
        toast.error("error occured while submitting employerDetails")
      }

    }
  })
  useEffect(() => {
    if (initialData?.logo) {
      const logoFileName = initialData?.logo.includes('\\')
        ? initialData?.logo.split('\\').pop()
        : initialData?.logo;
      const logoURL = `http://localhost:4000/uploads/company-logo/${logoFileName}?t=${new Date().getTime()}`;
      setLogo(logoURL)
      formik.setFieldValue('logo', logoURL)
    }
  }, [initialData?.logo])
  const handleLocationChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim()
    setLocationInput(query)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(async () => {
      if (query) {
        try {
          const locations = await fetchLocationSuggestions(query)
          setLocationSuggestions(locations)
        } catch (error) {
          toast.error("failedto fetch location suggestions")
        }
      }
      else {
        setLocationSuggestions([])
      }
    }, 500)
  }
  const handleLocationSelect = (location: string) => {
    formik.setFieldValue('location', location)
    setLocationInput(location)
    setLocationSuggestions([])
  }


  return (
    <form className="min-h-screen bg-[#0A0A0A] text-white p-6" onSubmit={formik.handleSubmit}>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">About company</h1>
        </div>
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-medium mb-2">Basic Information</h3>
            <p className="text-gray-400 text-sm mb-6">
              This is company information that you can update anytime
            </p>
          </section>
          <section>
            <h3 className="text-sm font-medium mb-2">Company Logo</h3>
            <p className="text-gray-400 text-s mb-4">
              This image will be shown publicly as company logo
            </p>
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#1A1A1A]  rounded-lg overflow-hidden">
                {logo ? (
                  <img
                    src={logo}
                    alt="company logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">N</span>
                  </div>
                )}
              </div>
              <label className="flex-1 border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors">
                <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Click to replace</span>
                  <span>or drap and drop</span>
                  <span className="text-xs">
                    SVG,PNG,JPG or GIF(max.400 x 400px)
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleLogoUpload}
                  accept="image/*"


                />

              </label>
              {formik.touched.logo && formik.errors.logo && (
                <p className='text-red-500 text-sm'>{formik.errors.logo}</p>
              )}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-medium mb-6">Company Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps('companyName')}
                  className={`w-full bg-[#1A1A1A] border ${formik.touched.companyName && formik.errors.companyName ? "border-red-500" : "border-gray-800"
                    } rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]`}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <span className="text-red-500 text-sm">{formik.errors.companyName}</span>
                )}

              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  required

                  {...formik.getFieldProps('website')}
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]"
                />
                {formik.touched.website && formik.errors.website && (
                  <p className='text-red-500 text-sm'>{formik.errors.website}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id='location'
                  required

                  {...formik.getFieldProps('location')}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleLocationChange(e);
                  }}
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]"
                />
                {formik.touched.location && formik.errors.location && (
                  <p className='text-red-500 text-sm'>{formik.errors.location}</p>
                )}
                {locationSuggestions.length > 0 && (
                  <ul className='bg-[#1A1A1A] border border-teal-500 rounded mt-2'>
                    {locationSuggestions.map((loc) => (
                      <li
                        key={loc.id}
                        className="p-2 hover:bg-zince-700 cursor-pointer"
                        onClick={() => handleLocationSelect(loc.name)}
                      >
                        {loc.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">
                    Employees
                  </label>
                  <select

                    {...formik.getFieldProps('employees')}
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]"
                  >
                    <option value='' disabled>Select number of employees</option>
                    <option value='0-20'>0-20</option>
                    <option value='20-50'>20-50</option>
                    <option value='50-100'>50-100</option>
                    <option value='100+'>100+</option>

                  </select>
                  {formik.touched.employees && formik.errors.employees && (
                    <span className="text-red-500 text-sm">{formik.errors.employees}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400">
                    Industry
                  </label>
                  <input
                    type="text"
                    required

                    {...formik.getFieldProps('industry')}
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]"
                  />
                  {formik.touched.industry && formik.errors.industry && (
                    <span className="text-red-500 text-sm">{formik.errors.industry}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">
                    Date founded
                  </label>
                  <input
                    type="date"
                    required


                    {...formik.getFieldProps('dateFounded')}


                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]"
                  />
                  {formik.touched.dateFounded && formik.errors.dateFounded && (
                    <span className="text-red-500 text-sm">{formik.errors.dateFounded}</span>
                  )}

                </div>

              </div>

            </div>
          </section>
          <section>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-gray-400 text-sm mb-4">
              Brief Description for your company.URLs are hyperlinked
            </p>
            <div className="space-y-4">
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg">
                <textarea id='description'
                  {...formik.getFieldProps('description')}
                  className={`w-full bg-[#1A1A1A] border ${formik.touched.description && formik.errors.description ? "border-red-500" : 'border-gray-800'
                    }rounded-lg px-4 py-2 focus:outline-none focus:border-[#0DD3B4]`} placeholder="Brief description about your company"></textarea>
                {formik.touched.description && formik.errors.description && (
                  <span className='text-red-500 text-sm'>{formik.errors.description}</span>
                )}
                <div className="border-t border-gray-800 p-2 flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 12h12M3 6h18M9 18h12"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>

                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <span className="text-sm text-gray-400">0/500</span>
              </div>
            </div>
          </section>
          <div className="flex justify-end pt-4">
            <button className="bg-[#0DD3B4] px-6 py-2 rounded-lg text-black" type="submit">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default EmployerForm;

