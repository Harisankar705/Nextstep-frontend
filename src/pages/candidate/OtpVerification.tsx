import React, { useState, useRef, useEffect, FC } from 'react';
import { Users, Globe2, Cpu, LucideIcon, Verified } from 'lucide-react';
interface OTPVerificationProps{
  onVerify:(otp:string)=>void
  onNext:(data:any)=>void
}
const OTPVerification:React.FC<OTPVerificationProps>=({ onVerify,onNext}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null)); // Corrected type
  const [isResending, setIsResending] = useState(false);
  const resendTimeout = useRef(null);
   const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    if (isResending) return;

    setIsResending(true);
    setCountdown(30);
    setTimeout(() => {
      setIsResending(false);
    }, 1000);
  };

  const handleVerify = (otp:string) => {
    if(otp.length===6 && otp.split('').every((digit)=>digit!==''))
    {
      onVerify(otp)
      onNext({verified:true})
    }
    else
    {
      alert('please enter all fields')
    }
  };

  const Feature: FC<{ icon: LucideIcon; title: string; subtitle: string }> = ({ icon: Icon, title, subtitle }) => (
    <div className="bg-black/30 rounded-lg p-6 flex flex-col items-center text-center space-y-2">
      <div className="bg-purple-600/20 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-purple-500" />
      </div>
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Logo and Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-600 w-6 h-6"></div>
            <span className="text-white text-xl font-bold">Next Step</span>
          </div>
          <p className="text-gray-400 text-sm">Your Career Journey Starts Here</p>

          <h1 className="text-4xl font-bold text-white mt-8">
            Your <span className="text-purple-500">next step</span><br />
            towards success<span className="text-purple-500">!!</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Feature icon={Users} title="Transparent Compensation" subtitle="Clear and fair payment structure" />
          <Feature icon={Globe2} title="Zero Commission" subtitle="No hidden fees or charges" />
          <Feature icon={Cpu} title="AI Powered Job Match" subtitle="Smart career recommendations" />
        </div>

        {/* OTP Section */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-white text-xl font-semibold mb-8">One-Time Password</h2>

          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 border border-gray-600 rounded-lg bg-transparent text-white text-center text-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            ))}
          </div>

          <button
            onClick={()=>handleVerify(otp.join(''))}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 mb-4 transition-colors"
          >
            Verify OTP
          </button>

          <div className="text-center">
            <button
              onClick={handleResendOTP}
              disabled={countdown > 0}
              className="text-gray-400 text-sm hover:text-purple-500 transition-colors disabled:opacity-50"
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
