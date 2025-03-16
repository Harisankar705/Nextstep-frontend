import { ArrowRight, KeyRound, Mail } from "lucide-react"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { forgotPassword } from "../../../services/commonService"
import { ForgotPasswordProps } from "../../../types/Candidate"

export const ForgotPassword:React.FC<ForgotPasswordProps>= ({role}) => {
    const [email,setEmail]=useState('')
    const [emailSent,setEmailSent]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        setIsLoading(true)
        try {
            const response=await forgotPassword(email,role)
            setEmailSent(true)
            console.log("RESPONSE",response)
            if(response.status===200)
            {
                toast.success("Password reset email send!")
                setEmail('')
            }
            else
            {
                toast.error("Failed to send reset password email")
            }
        } catch (error) {
            console.log("An error occured while sending reset email",error)
        }
        finally{
            setIsLoading(false)
        }
    }
    if(emailSent)
    {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-6">
                    <KeyRound className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white  mb-4">
                    Check your email
                  </h2>
                  <p className="text-zinc-400 mb-8">
                    If an account with {email} exists,we've sent a password reset link to your mail
                  </p>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Go to Login
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          );
    }
  return (
   <div className="min-h-screen bg-black flex items-center justify-center p-4">
    <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-full mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-purple-500"/>
            </div>
            <h1 className="text-2xl font-bold text-white text-center  mb-2">
                Forgot Password!
            </h1>
            <p className="text-zinc-400 text-center mb-8">
                No worries!Enter your email we'll send you reset instructions!
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                        Email address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"/>
                   
                    <input type="email" id='email' value={email} onChange={(e)=>setEmail(e.target.value)} 
                    required disabled={isLoading}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter your email"/>
                </div>
                </div>
                <button type="submit" disabled={isLoading || email===''}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    ):(
                        <>
                        Send Resent Link
                        <ArrowRight className="w-5 h-5"/>
                        </>
                    )}
                </button>
            </form> 
            <p className="mt-6 text-center text-zinc-500">
                Remember your password?{' '}
                <a href='/' className="text-purple-500 hover:text-purple-400 font-medium">Back to login</a>
            </p>
                    </div>
    </div>
   </div>
  )
}
