"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [credentials, setCredentials] = useState({
      staffId: "",
      password: "",
    });

    const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Authenticating staff:", credentials);
      // TODO: Connect to Django backend for staff authentication
    };

  return (
    <>
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6 font-sans">
      
      {/* Container max-width matches FB's standard split container */}
      <div className="max-w-[1000px] w-full grid lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Side: Branding (Hidden on mobile, side-by-side on desktop) */}
        <div className="hidden lg:flex flex-col pr-8 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/logo1.png" 
              alt="DreamHome Logo" 
              className="h-16 w-auto object-contain" 
              onError={(e) => {
                // Fallback icon if logo path fails
                e.target.outerHTML = '<div class="bg-[#003580] text-white p-3 rounded-lg text-2xl font-bold">DH</div>';
              }}
            />
            <h1 className="text-[3.5rem] font-extrabold text-[#003580] tracking-tight leading-none">
              DreamHome
            </h1>
          </div>
          <h2 className="text-[1.75rem] font-medium text-gray-800 leading-tight pr-4">
            Manage properties, staff, and renters efficiently and securely.
          </h2>
        </div>

        {/* Mobile Branding (Shows only on small screens) */}
        <div className="lg:hidden text-center order-first flex flex-col items-center">
          <img src="/DreamHomelogo.png" alt="DreamHome Logo" className="h-14 w-auto mb-2" />
          <h1 className="text-4xl font-extrabold text-[#003580] mb-2 tracking-tight">DreamHome</h1>
          <h2 className="text-lg text-gray-700">Staff & Management Portal</h2>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-[400px] mx-auto lg:mx-0 lg:ml-auto">
          {/* Card Style */}
          <div className="bg-white p-4 shadow-xl rounded-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Inputs styled like FB's large, padded inputs */}
              <div>
                <input
                  type="text"
                  name="staffId"
                  placeholder="Email address or Staff ID"
                  value={credentials.staffId}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-[#003580] text-[17px]"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-[#003580] text-[17px]"
                  required
                />
              </div>

              {/* Primary Login Button (DreamHome Blue) */}
              <button
                type="submit"
                className="w-full bg-[#003580] hover:bg-[#00265c] text-white font-bold text-xl py-3 rounded-md transition-colors"
              >
                Log In
              </button>

              {/* Forgot Password Link (DreamHome Pinkish-Red) */}
              <div className="text-center pt-1">
                <a href="#" className="text-[#E11553] hover:underline text-sm font-medium">
                  Forgotten password?
                </a>
              </div>

              <hr className="my-5 border-gray-200" />

              {/* Secondary Action Button (DreamHome Pinkish-Red) */}
              <div className="flex justify-center pb-2">
                <button
                  type="button"
                  className="bg-[#E11553] hover:bg-[#C11246] text-white font-bold text-[17px] py-3 px-6 rounded-md transition-colors"
                >
                  Request Staff Access
                </button>
              </div>
              
            </form>
          </div>

          {/* Under-card text */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <span className="font-bold hover:underline cursor-pointer text-gray-800">Admin Portal</span> is restricted to authorized personnel only.
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
