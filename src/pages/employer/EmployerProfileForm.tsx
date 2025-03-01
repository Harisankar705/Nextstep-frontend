import { employerDetails } from "../../services/employerService"
import EmployerForm from "./EmployerForm"
import { useDispatch, useSelector } from "react-redux"
import SideBar from "./SideBar"
import { setEmployer } from "../../redux/employerSlice"
import { Employer } from "../../types/Candidate"
import { useState } from "react"
import Spinner from "../../utils/Spinner"
export const EmployerDetails = () => {
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(false)
    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
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
        finally{
            setLoading(false)
        }
    }
    if(loading)
        {
            <Spinner loading={true}/>
        }
    return <EmployerForm onSubmit={handleSubmit} buttonText="Update profile" isEdit={true} />
}
export const EditProfile = () => {
    console.log("IN EDIT PROFILE")
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(false)
    const employer = useSelector((state: { user: Employer }) => state.user)
    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            formData.append('type', 'edit')
            const response = await employerDetails(formData)
            if (response.success && response.redirectTo) {
                dispatch(setEmployer(response.updatedUser))
                setTimeout(() => {
                    window.location.href = response.redirectTo
                }, 2000)
            }
        } catch (error) {
            throw new Error('error occured in editprofile')
        }
        finally{
            setLoading(false)
        }
        if(loading)
        {
            <Spinner loading={true}/>
        }
        <EmployerForm onSubmit={handleSubmit} buttonText="save changes" isEdit={false} />
    }
    return (
        <div className='flex flex-col lg:flex-row min-h-screen bg-[#0A0A0A] text-white'>
            <SideBar />
            <div className="flex-1 container mx-auto px-4 py-12">
                <EmployerForm
                    initialData={employer}
                    onSubmit={handleSubmit}
                    buttonText="Update profile"
                />
            </div>
        </div>
    )
}
