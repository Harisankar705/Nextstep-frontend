    import React, { useState, useEffect, useRef } from "react";
    import { useNavigate } from "react-router-dom";
    import { ArrowRight, EyeOff, Eye } from "lucide-react";
    import { Logo } from "../../components/Logo";
    import { checkEmailOrPhone, register, resendOTP, sendOTP, verifyOTP } from "../../services/authService"; // Assuming these are your OTP functions
    import { validateConfirmPassword, validateMail, validateName, validatePassword, validatePhoneNumber } from "../../utils/ValidationUtils";
    import InputField from "../../utils/InputField";
    import {toast} from 'react-toastify'
    import CustomToast from "../../utils/CustomToast";

    const Signup: React.FC = () => {
      const navigate = useNavigate();
      const handleLoginClick = () => {
        navigate("/login");
      };

      const [firstName, setFirstName] = useState('');
      const [secondName, setSecondName] = useState('');
      const [email, setEmail] = useState('');
      const [phonenumber, setPhonenumber] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [otpSent, setOtpSent] = useState(false);
      const [otp, setOtp] = useState(['', '', '', '','','']);
      const [countdown, setCountdown] = useState(0); 
      const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
      const [otpVerified, setOtpVerified] = useState(false);
      const [isRegistered, setIsRegistered] = useState(false);
      const [isResending,setIsResenting]=useState(false)
      useEffect(()=>{
        if(otpVerified )
        {
          handleRegister()
        }
      },[otpVerified])

      const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        const nameError = validateName(firstName) || validateName(secondName);
        const emailError = validateMail(email);
        const phonenumberError = validatePhoneNumber(phonenumber);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

        if (nameError || emailError || phonenumberError || passwordError || confirmPasswordError) {
          setError(nameError || emailError || phonenumberError || passwordError || confirmPasswordError || "");
          return;
        }
        try {
          const isTaken=await checkEmailOrPhone(email,phonenumber,'user')
          console.log("ISTAKEN",typeof isTaken)
          if(isTaken)
          {
            setError("email or phone number is already registered!")
            toast.error("email or phone number is already registered!")
            return
            
          }
          else
          {
            if(otpSent)return
            const response = await sendOTP(email, 'user');
            console.log("RESPONSE", response.message);
            setOtpSent(true);
            startCountdown();
          }
        } catch (error) {
          setError('Error occurd while checking for email or phone');
        }

        try {
        
        } catch (error) {
          setError('Failed to send OTP');
        }
      };

      const startCountdown = () => {
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

      const handleResendOTP =async () => {
        try {
          if(isResending ||countdown>0)return
          setIsResenting(true)
         
          setError('')
          setOtp(['','','','','',''])
          const response=await resendOTP(email,'user')
          if(response.success)
          {
            setOtpSent(true)
            startCountdown()
            toast.success("OTP resend success!")
          }
          else
          {
            toast.error("Failed to resend OTP!")
          }
        } catch (error) {
          setError("error occured while resending otp")
          toast.error("Failed to resend otp")
        }
        
        setOtp(['', '', '', '','','']);
        handleSubmit();
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
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };

      const handleVerify = async () => {
        const otpString = otp.join('');
        const verified = await verifyOTP(email, otpString, 'user');
        console.log("VERIFIED",verified)
        if (verified.message==="OTP verification successfull!") {    

          console.log('OTP verified successfully');
          setOtpVerified(true);
          handleRegister()
          toast.success("OTP verified successfull!")
        
          // navigate('/login');
          console.log(otpVerified)
        } else if(verified.message==="Failed to verify otp") {
          setError('OTP verification failed');
          toast.error("OTP verification failed!Try again!")
        }
      };

      const handleRegister = async () => {
        if (otpVerified) {
          const userData = {
            firstName,
            secondName,
            email,
            password,
            name: `${firstName} ${secondName}`,
            role: 'user' as "user" | "employer",
          };
          try {
            setLoading(true);
            console.log("IN handleregister")
            const response = await register(userData, otp.join(''));
            toast.success("Registeration successfull!")
            setLoading(false);
            setIsRegistered(true);
            navigate('/login');
          } catch (error) {
            setLoading(false);
            setError("Registration failed");
          }
        }
      };

      return (
        <div className="min-h-screen w-full bg-[#1a1625] text-white flex items-center justify-center">
          <div className="container max-w-[1100px] px-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Logo width={400} height={107} className="mb-4" />
                  <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    Your next step{" "}
                    <span className="text-[#8257e7]">towards success!</span>
                  </h1>
                  <p className="text-muted">Join us for various opportunities!</p>
                </div>
                <p className="text-sm text-muted-foreground">Trusted by Global Brands!</p>
              </div>

              {/* Conditionally render OTP input form if otpSent is true */}
              {otpSent ? (
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto mt-6">
              <h2 className="text-white text-xl font-semibold mb-8">One-Time Password</h2>
              <div className="flex justify-center mb-8 space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 border border-gray-600 rounded-lg bg-transparent text-white text-center text-2xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                ))}
              </div>
              <button
                onClick={handleVerify}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 mb-4 transition-colors"
              >
                Verify OTP
              </button>
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={isResending||countdown > 0}
                  className="text-gray-400 text-sm hover:text-purple-500 transition-colors disabled:opacity-50"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
            
            
            
              ) : (
                <div className="bg-[#1e1c29] rounded-lg p-6 space-y-6">
                  <h2 className="text-lg font-semibold">Create an account</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <InputField
                          type="text" label="first Name"
                          validationFn={validateName}
                          value={firstName}
                          placeholder="First Name"

                          onChange={setFirstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <InputField
                          label="Second Name"
                          type="text"
                          value={secondName}
                          onChange={setSecondName}
                          placeholder="Second Name"
                          validationFn={validateName}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <InputField
                        label="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={setEmail}
                        validationFn={validateMail}
                      />
                    </div>
                    <div className="space-y-2">
                      <InputField
                        label="Phone number"
                        type="text"
                        value={phonenumber}
                        placeholder="Phone number"
                        onChange={setPhonenumber}
                        validationFn={validatePhoneNumber}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <InputField
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          placeholder="Password"
                          onChange={setPassword}
                          validationFn={validatePassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-12 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                          aria-label={showPassword ? "Hide Password" : "Show Password"}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <InputField
                          label="Confirm Password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={setConfirmPassword}
                          placeholder="Confirm Password"
                          validationFn={(value) => validateConfirmPassword(password, value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-12 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 bg-[#8257e6] rounded-md hover:bg-[#82576e]/90 text-white font-semibold disabled:bg-[#8257e6]/60"
                    >
                      {loading ? "Signing up..." : "Sign up"}
                    </button>
                    
                  </form>
                  <div className="flex items-center gap-2 rounded-lg bg-[#2a2837] p-4">
                  <div className="h-8 w-8 rounded-lg bg-[#1e129]" />
                  <div className="flex-1">
                    <p className="text-sm cursor-pointer" onClick={handleLoginClick}>Already have an account</p>
                    <p className="text-xs text-gray-400">Signup</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    export default Signup;
