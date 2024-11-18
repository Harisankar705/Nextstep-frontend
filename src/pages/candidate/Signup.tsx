import React, { useState } from "react";
import { ArrowRight, EyeOff,Eye } from "lucide-react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { validateConfirmPassword, validateMail, validateName, validatePassword, validatePhoneNumber } from "../../utils/ValidationUtils";

const Signup = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };

  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [role] = useState('user');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword,setShowPassword]=useState(false)
  const [showConfirmPassword,setShowConfirmPassword]=useState(false)

  const handleSubmit = (e:any) => {
    e.preventDefault();
    setError('')
    const nameError=validateName(firstName)||validateName(secondName)
    const emailError=validateMail(email)
    const phonenumberError=validatePhoneNumber(phonenumber)
    const passwordError=validatePassword(password)
    const confirmPasswordError=validateConfirmPassword(password,confirmPassword)
    
    if(nameError||emailError||phonenumberError||passwordError||confirmPasswordError)
    {
      setError(nameError||emailError||phonenumberError||passwordError||confirmPasswordError||"")
      return 
    }
    
    setLoading(true);
    setTimeout(() => {  
      setLoading(false);
      console.log({ firstName, secondName, email, phonenumber, password, role });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1625] text-white flex items-center justify-center">
      <div className="container max-w-[1100px] px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className=" flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Logo width={400} height={107} className="mb-4" />
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Your next step{"  "}
                <span className="text-[#8257e7]">towards success!</span>
              </h1>
              <p className="text-muted">Join us for various opportunities!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by Global Brands!
            </p>
          </div>
          <div className="bg-[#1e1c29] rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold">Create an account</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="secondName" className="text-sm">
                    Second Name
                  </label>
                  <input
                    type="text"
                    id="secondName"
                    value={secondName}
                    placeholder="Second Name"
                    onChange={(e) => setSecondName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phonenumber" className="text-sm">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phonenumber"
                  value={phonenumber}
                  placeholder="Phone number"
                  onChange={(e) => setPhonenumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <div className="relative">
                <input
                  type={showPassword?"text":"password"}
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none" aria-label={showPassword ?"Hide Password":"Show Password"}>

                  {showPassword ?<EyeOff/>:<Eye/>}
                </button>
                </div>
                
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </label>
                <div className='relative'>
                <input
                  type={showConfirmPassword ?"text":"password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                />
                <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none">
                  {showConfirmPassword?<EyeOff/>:<Eye/>}
                </button>
                </div>
               
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#8257e6] rounded-md hover:bg-[#82576e]/90 transition-colors"
              >
                {loading ? "Wait..." : "Continue"}
              </button>
            </form>
            <p className="text-sm text-center text-gray-400">
              By signing up, you agree to our{" "}
              <span className="text-[#8257e6]">Terms of Use</span> and{" "}
              <span className="text-[#8257e6]">Privacy Policy</span>
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-[#2a2837] p-4">
              <div className="h-8 w-8 rounded-lg bg-[#1e129]" />
              <div className="flex-1">
                <p className="text-sm">Already have an account?</p>
                <p
                  className="text-xs text-gray-400 cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Login here
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
