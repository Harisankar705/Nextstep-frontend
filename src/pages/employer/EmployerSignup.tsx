import React, { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'
import { validateConfirmPassword, validateMail, validateName, validatePassword } from "../../utils/ValidationUtils";
import { checkEmailOrPhone, register, sendOTP, verifyOTP, resendOTP } from "../../services/authService";
import { EyeOff, Eye } from "lucide-react";

const EmployerSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSend] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResending, setIsResenting] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/employerlogin");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const nameError = validateName(companyName);
    const emailError = validateMail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setError(nameError || emailError || passwordError || confirmPasswordError || "");
      return;
    }

    try {
      const isTaken = await checkEmailOrPhone(email,"",  'employer',companyName);
      if (isTaken) {
        setError("Email already registered");
        toast.error("Email already registered");
        return;
      }

      if (otpSent) return;
      const response = await sendOTP(email, "employer");
      setOtpSend(true);
      toast.success('OTP has been sended!Check your mail!')
      startCountDown();
    } catch (error) {
      
      setError("Error occurred while checking for OTP");
    }
  };

  const startCountDown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    try {
      if (isResending || countdown > 0) return;
      setIsResenting(true);

      setError("");
      setOtp(["", "", "", "", "", ""]);
      const response = await resendOTP(email, "employer");
      console.log("RESEND respons",response)
      if (response.message="OTP resended!") {
        setOtpSend(true);
        toast.success("OTP has been resended!")
        startCountDown();
      } else {
        toast.error("Failed to resend OTP!")
      }
    } catch (error) {
      setError("Error occurred while resending OTP");
      toast.error("Failed to resend OTP");
    }
    setOtp(["", "", "", "", "", ""]);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    try {
      const verified = await verifyOTP(email, otpString, "employer");
    if (verified.message === "OTP verification successfull!") {
      setOtpVerified(true);
      handleRegister();
      toast.success("OTP verified successfully!");
    } else {
      // setError("OTP verification failed");
      toast.error("OTP verification failed! Try again!");
    }
    } catch (error) {
      // setError("OTP verification failed");
      toast.error("OTP verification failed! Try again!");
    }
    
  };

  const handleRegister = async () => {
    console.log("IN handleregister")

    console.log("OTPVERIFIED", otpVerified)
    const employerData = {
      companyName,
      email,
      password,
      role: "employer" as 'employer',
      firstName: "",
      secondName: "",
      name: companyName
    };
    console.log("EMPLOYERDATA", employerData)
    try {
      setLoading(true);
      const response = await register(employerData, otp.join(""));
      console.log("RESPONSE", response)
      toast.success("Registration completed");
      setLoading(false);
      setIsRegistered(true);
      navigate("/employerlogin");
    } catch (error) {
      setLoading(false);
      setError("Registration failed");
    }

  };

  return (
    <div className="min-h-screen w-full bg-[#111827] text-white flex items-center justify-center">
      <div className="container max-w-[1100px] px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <Logo width={400} height={107} className="mb-4" />
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Let's Find your perfect{" "}
              <span className="text-[#0DD3B4]">Candidate</span>
            </h1>
            <p className="text-sm text-muted-foreground">Trusted by Global Brands!</p>
          </div>
          <div className="space-y-6">
            {otpSent ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Enter the OTP sent to your email</h2>
                <div className="flex space-x-2 justify-center">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4]"
                    />
                  ))}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  onClick={handleVerify}
                  className="w-full bg-[#0DD3B4] text-black font-medium py-2 px-4 rounded-md hover:bg-[#0DD3B4]/90 transition-colors"
                >
                  Verify OTP
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Didn’t receive OTP?</span>
                  <button
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                    className={`text-[#0DD3B4] hover:underline ${countdown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Resend OTP {countdown > 0 && `(${countdown}s)`}
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-2" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm" htmlFor="Company_name">
                    Company's Name
                  </label>
                  <input
                    id="company_name"
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter the company's name"
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm" htmlFor="email">
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                    type="email"
                  />
                </div>
                <div className="relative space-y-2">
                  <label className="text-sm" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                    type={showPassword ? "text" : "password"}
                  />
                  <span
                    className="absolute top-9 right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
                <div className="relative space-y-2">
                  <label className="text-sm" htmlFor="confirm_password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <span
                    className="absolute top-9 right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit" disabled={loading||otpSent}
                  className="w-full bg-[#0DD3B4] text-black font-medium py-2 px-4 rounded-md hover:bg-[#0DD3B4]/90 transition-colors"
                >
                  {loading ? "Loading..." : "Sign Up"}
                </button>
              </form>
            )}
            <button
              onClick={handleLogin}
              className="w-full border border-gray-600 bg-transparent text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Already have an account? Log In
            </button>
            {/* <button
              onClick={() => console.log("Google Login")}
              className="w-full flex items-center justify-center border border-gray-600 bg-transparent text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              <FcGoogle className="mr-2" /> Sign Up with Google
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
