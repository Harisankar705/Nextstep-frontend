import React from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
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
              <p className="text-muted">Join us for various oppourtunites!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by Global Brands!
            </p>
          </div>
          <div className="bg-[#1e1c29] rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold ">Create an account</h2>
            <form className="space-y-4">
              <div className=" grid grid-cols-1 lg:grid-cols-2  gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstname" className="text-sm">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="firstname"
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
                    className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="email"
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm">
                  Email
                </label>
                <input
                  type="number"
                  id="phonenumber"
                  placeholder="Phone number"
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#8257e6] rounded-md hover:bg-[#82576e]/90 transition-colors"
              >
                Continue
              </button>
            </form>
            <p className="text-sm text-center text-gray-400">
              By signing up,you agree to our {""}
              <span className="text-[#8257e6]">Terms of use</span> and{""}
              <span className="text-[#8257e6]">Privacy Policy</span>
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-[#2a2837] p-4">
              <div className="h-8 w-8 rounded-lg bg-[#1e129]" />
              <div className="flex-1">
                <p className="text-sm">Already have an account!</p>
                <p className="text-xs text-gray-400 cursor-pointer" onClick={handleLoginClick}>
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
