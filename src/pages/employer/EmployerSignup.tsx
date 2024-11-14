import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";

const EmployerSignup = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/employerlogin");
  };
  return (
    <div className="min-h-screen w-full bg-[#111827] text-white flex items-center justify-center">
      <div className="container max-w-[1100px] px-4">
        <div className=" grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <Logo width={400} height={107} className="mb-4" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Let's Find your perfect{" "}
                <span className="text-[#0DD3B4]">Candidate</span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by Global Brands!
            </p>
          </div>
          <div className="space-y-6">
            <form className="space-y-2">
              <div className="space-y-2">
                <label className="text-sm" htmlFor="Company_name">
                  Company's Name
                </label>
                <input
                  id="company_name"
                  placeholder="enter the company's name"
                  className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  placeholder="enter your email"
                  className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DD3B4] focus:border-transparent"
                  type="email"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0DD3B4] text-black font-medium py-2 px-4 rounded-md hover:bg-[#0DD3B4]/90 transition-colors"
              >
                Signup
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 bg-[#0DD3B4] text-black font-medium py-2 px-4 rounded-md hover:bg-[#0dd3b4]/90 transition-colors"
              >
                <FcGoogle className="w-4 h-4" />
                <span className="text-sm">Signup with Google!</span>
              </button>
            </form>
            <div className="text-center text-sm">
              <span className="text-gray-400">
                Already had a employer account!{" "}
              </span>
              <button
                onClick={handleLogin}
                className="text-[#0dd3b4] hover:underline"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
