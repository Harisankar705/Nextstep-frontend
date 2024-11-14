import React from "react";

import { ArrowRight } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen w-full bg-[#1a1625] text-white flex items-center justify-center">
      <div className="container max-w-[1100px] px-4">
        <div className=" grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
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
          <div className="bg-[#1e1c29] rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold">Login</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  placeholder="enter your email"
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8257e6]"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#8257e6] hover:underline"
                  >
                    Forgot Password
                  </button>
                </div>
                <input
                  id="password"
                  placeholder="enter your password"
                  className="w-full px-3 py-2 bg-[#2a2837] rounded-mg text-white placeholder-gray-400 focus:outline-none focus:ring-[#8256e6]"
                  type="password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2  bg-[#8257e6] rounded-md hover:bg-[#8257e6]/90 transition-colors"
              >
                Login
              </button>
            </form>
            <button
              type="button"
              className="w-full py-2 border border-[#8257e6] text[#8257e6] rounded-md  hover:bg-[#8257e6] hover:text-white transition-colors"
            >
              Continue With Google
            </button>
            <div className="flex items-center gap-2 rounded-lg bg-[#2a2837] p-4">
              <div className="h-8 w-8 rounded-lg bg-[#1e129]" />
              <div className="flex-1">
                <p className="text-sm">Explore Jobs</p>
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
