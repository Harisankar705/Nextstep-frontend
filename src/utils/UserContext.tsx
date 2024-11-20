import React, { createContext, useContext, useState } from 'react'
interface SignUpContextType {
    userData: {
        firstName: string
        secondName: string
        email: string
        password: string
        phonenumber: string
        confirmPassword: string
        role: string


    }
    setUserData: React.Dispatch<React.SetStateAction<{
        firstName: string
        secondName: string
        email: string
        password: string
        confirmPassword: string
        phonenumber: string
        role: string



    }>
    >
    resetUserData: () => void
}
const SignupContext = createContext<SignUpContextType | undefined>(undefined)
export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        phonenumber: '',
        confirmPassword: "",
        role: 'user'

    })
    const resetUserData = () => {
        setUserData({
            firstName: "",
            secondName: "",
            email: "",
            phonenumber: '',
            confirmPassword: "",
            password: "",
            role: "user"
        })
    }
    return (
        <SignupContext.Provider value={{ userData, setUserData, resetUserData }}>
            {children}
        </SignupContext.Provider>
    )
}
export const useSignupContext = () => {
    const context = useContext(SignupContext)
    if (!context) {
        throw new Error("error in use signup context")
    }
    return context
}