import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { EyeOff, Eye } from "lucide-react";
import {toast} from 'react-hot-toast'
import { setEmployer } from "../../redux/employerSlice";
import { useDispatch } from "react-redux";

const EmployerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const handleSignup = () => {
    navigate("/employersignup");
  };

  const handleLoginClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both fields!");
      return;
    }

    setLoading(true);
    setError('')
    try {
      const response = await login(email, password, "employer");
      console.log('rrrrr',response)
      toast.success("Login success")
      dispatch(setEmployer(response.user))
      if(response.user.isProfileComplete)
      {
        navigate('/employerhome')
      }
      else
      {
        navigate('/employerdetails',{replace:true})
      }
      
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);

      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111827] text-white flex items-center justify-center">
      <div className="container max-w-[1100px] px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <Logo width={400} height={107} className="mb-4" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl -mt-5">
                Find your perfect{" "}
                <span className="text-[#0DD3B4]">Candidate</span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Trusted by Global Brands!</p>
          </div>
          <div className="space-y-6">
            <form className="space-y-2" onSubmit={handleLoginClick}>
              <div className="space-y-2">
                <label className="text-sm" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                  type="email"
                  value={email}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                  type={showPassword ? "text" : "password"} // Dynamically change input type based on `showPassword`
                  value={password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}

              <button
                type="submit"
                className="w-full bg-[#0DD3B4] text-black font-medium py-2 px-4 rounded-md hover:bg-[#0DD3B4]/90 transition-colors"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 bg-[#0DD3B4] text-black font-medium py-2 px-4 rounded-md hover:bg-[#0dd3b4]/90 transition-colors"
              >
                <FcGoogle className="w-4 h-4" />
                <span className="text-sm">Login with Google!</span>
              </button> */}
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-400">Don't have an Account? </span>
              <button onClick={handleSignup} className="text-[#0dd3b4] hover:underline">
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
