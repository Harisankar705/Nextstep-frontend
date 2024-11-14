import React from "react";
import { CircleDollarSign, Search, ArrowRight } from "lucide-react";
const Signup = () => {
  return (
    <div className="min-h-screen bg-[#1c1c27] p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-[#1c1c27] text-white rounded-lg overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-8">
            <div className="mb-8">
              <p className="text-2xl font-light">
                Your next step towards success!
                <span className="text-purple-400">!!</span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: CircleDollarSign, text: "Zero Commision!" },
                { icon: Search, text: "Quick Job Search" },
                { icon: ArrowRight, text: "AI powered job match!" },
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center gap-2 border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {React.createElement(item.icon,{className:'w-6 h-6'})}
                  <span className="text-center text-xs">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-8 bg-[#12121a]">
            <h2 className="text-2xl font-semibold mb-6">Let's get you hired!</h2>
            <form className="space-y-4">
              <div className=" grid grid-cols  gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="firstname"
                    className="w-full px-3 py-2 bg-[#1c1c27] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="secondName"
                    className="block text-sm font-medium mb-1"
                  >
                    Second Name
                  </label>
                  <input
                    type="text"
                    id="secondName"
                    placeholder="secondName"
                    className="w-full px-3 py-2 bg-[#1c1c27] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  className="w-full px-3 py-2 bg-[#1c1c27] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label
                  htmlFor="phone number"
                  className="block text-sm font-medium mb-1"
                >
                  Phone number
                </label>
                <input
                  type="number"
                  id="phonenumber"
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 bg-[#1c1c27] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                type="submit"
                className="w-full px-3 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-gray-500">
              By clicking on continue,you agree to our Terms of Use and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
