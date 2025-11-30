"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("@hotel.app");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ereur, setEreur] = useState("");
  const [goodCreat, setgoodCreat] = useState("");
  const router = useRouter();

  const CreateAcount = async (e) => {
    e.preventDefault();

    if (!name || !email || !pass) {
      setEreur("All fields are necessary.");
      return;
    }

    setIsLoading(true);

    // Hash the password
    try {
      const response = await Axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URl}/register`,
        { name, email, pass },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        // alert('User registered successfully.')
        console.log("User registered successfully:", data);
        setName("");
        setEmail("");
        setPass("");
        // setgoodCreat("");
        toast("User registered successfully.", {
          type: "success", // Can be 'success', 'error', 'info', etc.
          position: "top-center", // Adjust position as needed
          autoClose: 3000, // Milliseconds before auto-dismissal
        });
        router.push("Login");
      } else {
        console.error(
          "Registration failed. Server returned:",
          response.status,
          response.statusText
        );
        // setEreur("Registration failed. Please try again.");
        toast("Registration failed. Please try again.", {
          type: "error", // Can be 'success', 'error', 'info', etc.
          position: "top-center", // Adjust position as needed
          autoClose: 3000, // Milliseconds before auto-dismissal
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // setEreur("Email already exists. Please use a different email.");
      toast("Email already exists. Please use a different email.", {
        type: "error", // Can be 'success', 'error', 'info', etc.
        position: "top-center", // Adjust position as needed
        autoClose: 3000, // Milliseconds before auto-dismissal
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: `url('image.jpg')` }}
      className="flex items-center  justify-center  bg-gray-50 text-black -mt-20">
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(251, 146, 60, 0.2);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15);
        }
        
        .input-field {
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(249, 115, 22, 0.2);
          border-color: #f97316;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(249, 115, 22, 0.4);
        }
        
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .logo-container {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-md mt-[108px] mb-8">
        {/* Logo */}
        <div className="text-center mb-4 logo-container">
          <Image
            src="/Images/logo.png"
            className="mx-auto"
            alt="Hotel Logo"
            height={80}
            width={80}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join us and start your journey!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={CreateAcount} className="space-y-3">
          {/* Name Input */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              placeholder="example@hotel.app"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="input-field w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-xl text-white font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-gray-600 text-xs">
              Already have an account?{" "}
              <Link
                href="/Login"
                className="text-orange-600 hover:text-orange-700 font-semibold underline decoration-2 underline-offset-2 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default page;
