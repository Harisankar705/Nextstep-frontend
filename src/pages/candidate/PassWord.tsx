import React, { useState } from "react";
import { EyeOff, EyeIcon } from "lucide-react";
interface PasswordProps{
  onNext:(data:any)=>void
}
const PassWord:React.FC<PasswordProps> =({onNext})=> {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword]=useState(false)
  const requirements = [
    { text: "Minimum 8 characters", test: (pass: string) => pass.length >= 8 },
    { text: "Uppercase", test: (pass: string) => /[A-Z]/.test(pass) },
    { text: "Lowercase", test: (pass: string) => /[a-z]/.test(pass) },
  ];
  const handleNext=()=>{
    if(password!==confirmPassword)
    {
      alert("Passwords don't match")
      return
    }
    onNext({password})
  }

  const handleSubmit=()=>{
    const otpString=otp.join('')
    if(otpString.length===6)
    {
      onVerify(otpString)
    }
    else
    {
      alert('Please enter all fields!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to black p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl flex items-center justify-between gap-8 text-white">
        <div className="flex-1">
          <div className="text-3xl font-semibold leading-tight">
            You are just <span className="text-white">one step</span> away from
            accessing the <span className="text-purple-400">dream job!</span>
          </div>
        </div>
        <div className="bg-black/30 backdrop:blur-sm rounded-lg p-6 w-96">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-6">Set password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/30 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={confirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/30 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!confirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Your password must contain</p>
                <ul className="space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index} className={`text-sm flex items-center gap-2 ${req.test(password) ? 'text-green-400' : "text-gray-400"
                      }`}>
                      <span className="text-xs">•</span>
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={handleSubmit} className="w-full b  g-purple-600 hover:bg-purple-700 text-white rounded py-2 mt-6 transition colors">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassWord;
