import { useEffect, useState } from "react"
import { employerDetails } from "../../services/employerService"
import EmployerForm from "./EmployerForm"
import { useDispatch, useSelector } from "react-redux"
import SideBar from "./SideBar"
import { setEmployer } from "../../redux/employerSlice"

export const EmployerDetails = () => {
    const dispatch=useDispatch()
    const handleSubmit = async (formData: FormData) => {
        try {
            const response = await employerDetails(formData)
           
        } catch (error) {
            
           throw new Error("Error occured while updating details")
        }
    }
    return <EmployerForm onSubmit={handleSubmit} buttonText="Save changes" />
}

export const EditProfile = () => {
    const dispatch = useDispatch()

    const employerData = useSelector((state: any) => state.employer)

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
    }

    return (
        <div className='min-h-screen bg-[#0A0A0A] text-white'>
            <SideBar />
            <div className="container mx-auto px-4 py-12 ml-[300px]">
                <EmployerForm
                    initialData={employerData}
                    onSubmit={handleSubmit}
                    buttonText="Update profile"
                />
            </div>
        </div>
    )
}
