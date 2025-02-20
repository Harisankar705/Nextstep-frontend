import { employerDetails } from "../../services/employerService"
import EmployerForm from "./EmployerForm"
import { useDispatch, useSelector } from "react-redux"
import SideBar from "./SideBar"
import { setEmployer } from "../../redux/employerSlice"
import { Employer } from "../../types/Candidate"

export const EmployerDetails = () => {
    const dispatch=useDispatch()
    const handleSubmit = async (formData: FormData) => {
        try {
            const response = await employerDetails(formData)
            if (response.success && response.redirectTo) {
                dispatch(setEmployer(response.updatedUser))
                setTimeout(() => {
                    window.location.href = response.redirectTo
                }, 2000)

            }
           
        } catch (error) {
            
           throw new Error("Error occured while updating details")
        }
    }
    return <EmployerForm onSubmit={handleSubmit} buttonText="Update profile" isEdit={true} />
}

export const EditProfile = () => {
    const dispatch = useDispatch()

    const employer=useSelector((state:{user:Employer})=>state.user)

    const handleSubmit = async (formData: FormData) => {
        try {
            formData.append('type', 'edit')
            const response = await employerDetails(formData)
            if(response.success && response.redirectTo)
            {
                dispatch(setEmployer(response.updatedUser))
                setTimeout(()=>{
                    window.location.href = response.redirectTo
                },2000)
                
            }
            
        } catch (error) {
            throw new Error('error occured in editprofile')
        }
        <EmployerForm onSubmit={handleSubmit} buttonText="save changes" isEdit={false}/>
    }

    return (
        <div className='min-h-screen bg-[#0A0A0A] text-white'>
            <SideBar />
            <div className="container mx-auto px-4 py-12 ml-[300px]">
                <EmployerForm
                    initialData={employer}
                    onSubmit={handleSubmit}
                    buttonText="Update profile"
                />
            </div>
        </div>
    )
}
