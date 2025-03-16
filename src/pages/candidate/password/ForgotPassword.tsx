import { KeyRound, Mail, X } from "lucide-react"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { forgotPassword } from "../../../services/commonService"
import { ForgotPasswordProps } from "../../../types/Candidate"

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ role, onClose }) => {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await forgotPassword(email, role)
            setEmailSent(true)
            console.log("RESPONSE", response)
            if(response.status === 200) {
                toast.success("Password reset email sent!")
                setEmail('')
            } else {
                toast.error("Failed to send reset password email")
            }
        } catch (error) {
            console.log("An error occurred while sending reset email", error)
            toast.error("An error occurred while sending reset email")
        } finally {
            setIsLoading(false)
        }
    }

    if(emailSent) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="w-full max-w-md">
                    <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 text-center">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Check your email</h2>
                            <button 
                                onClick={onClose}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-6">
                            <KeyRound className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-zinc-400 mb-8">
                            If an account with {email} exists, we've sent a password reset link to your email
                        </p>
                        <button
                            onClick={onClose}
                            className="inline-flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <KeyRound className="w-5 h-5 text-purple-500 mr-2"/>
                            <h2 className="text-xl font-bold text-white">Forgot Password</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-zinc-400 mb-6">
                        No worries! Enter your email we'll send you reset instructions!
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"/>
                                <input 
                                    type="email" 
                                    id='email' 
                                    value={email} 
                                    onChange={(e)=>setEmail(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" 
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="w-1/2 border border-zinc-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || email===''}
                                className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                ):(
                                    "Send Reset Link"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}