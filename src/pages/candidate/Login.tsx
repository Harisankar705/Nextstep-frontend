import React, { useCallback, useState } from "react";
import { ArrowRight, EyeOff, Eye } from "lucide-react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { toast } from 'react-hot-toast'
import Spinner from "../../utils/Spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { GoogleAuth } from "../common/GoogleAuth";
import { ForgotPassword } from "./password/ForgotPassword";
const Login = () => {
  const [email, setEmail] = useState('')
  const [showForgotPassword,setShowForgotPassword]=useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const handleSignupClick = useCallback(() => {
    navigate('/signup')
  },[navigate])
  const handleForgotPassword=useCallback(()=>{
    setShowForgotPassword(true)
  },[])
  const handleLoginClick = useCallback(async (e:React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("fill all fields!")
      return
    }
    setLoading(true)
    try {
      const response = await login(email, password, 'user')
      toast.success("Login success",response)
      console.log("RESPONSE",response)
      dispatch(setUser(response.user))
      if (response.user.isProfileComplete) {
        navigate('/home',{replace:true})
      }
      else {
        navigate('/candidate-details', { replace: true })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage)
      setError(errorMessage);    }
    finally {
      setLoading(false)
    }
  },[email,password,dispatch,navigate])
  
  return (
    <div className="min-h-screen w-full bg-[#1a1625] text-white flex items-center justify-center p-4">
      <div className="container max-w-[1100px] px-4">
        <div className=" grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <Logo width={300} height={80} className="mx-auto  lg:mx-0" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Hiring Done <span className="text-[#8257e7]">right</span>
              </h1>
              <p className="text-muted">Your next step</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by Global Brands!
            </p>
          </div>
          <div className="bg-[#1e1c29] rounded-lg p-6 space-y-6 shadow-lg">
            <h2 className="text-lg font-semibold">Login</h2>
            <form className="space-y-4" onSubmit={handleLoginClick}>
              <div className="space-y-2">
                <label className="text-sm" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  placeholder="enter your email"
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-[#8257e6] hover:underline"
                  >
                    Forgot Password
                  </button>
                  {showForgotPassword && <ForgotPassword role="user"/>}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="enter your password"
                    className="w-full px-3 py-2 bg-[#2a2837] rounded-mg text-white placeholder-gray-400 focus:outline-none focus:ring-[#8256e6]"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2  bg-[#8257e6] rounded-md hover:bg-[#8257e6]/90 transition-colors"
                disabled={loading}
              >
                {loading ? <Spinner loading={true} /> : "Login"}
              </button>
              <GoogleAuth authType="login" role="user"/>
            </form>
            {/* <button
              type="button"
              onClick={()=>handleGoogleLogin()}
              className="w-full py-2 border border-[#8257e6] text[#8257e6] rounded-md  hover:bg-[#8257e6] hover:text-white transition-colors"
            >
              Continue With Google
            </button> */}
            <div className="flex items-center gap-2 rounded-lg bg-[#2a2837] p-4 cursor-pointer" onClick={handleSignupClick}>
              <div className="h-8 w-8 rounded-lg bg-[#1e129]" />
              <div className="flex-1">
                <p className="text-sm" >Don't have an account!</p>
                <p className="text-xs text-gray-400">Signup</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
