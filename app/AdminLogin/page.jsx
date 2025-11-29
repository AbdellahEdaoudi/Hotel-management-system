"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Page() {
  const [email, setEmail] = useState("@admin.app");
  const [pass, setPass] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const Login = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      setError("Email and password are required.");
      toast.error("Email and password are required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URl}/login`,
        { email, pass }
      );

      if (response.status === 200) {
        const userData = response.data;
        console.log("User Login successfully:", userData);
        setEmail("");
        setPass("");
        setSuccessMessage("User Login successfully.");
        toast.success("User Login successfully.", {
          position: "top-center",
          autoClose: 3000,
        });
        localStorage.setItem("accessTokenAdmin", userData.accessTokenAdmin);
        localStorage.setItem("nameuser", userData.name);
        window.location.assign("/Admin");
      } else {
        console.error(
          "Login failed. Server returned:",
          response.status,
          response.statusText
        );
        setError("Invalid credentials. Please try again.");
        toast.error("Invalid credentials. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid credentials. Please try again.");
      toast.error("Invalid credentials. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div style={{
      backgroundImage: `url('image.jpg')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} className="flex items-center justify-center text-black -mt-20 w-full">
      <section className="px-4 md:px-10 py-7 mt-[108px] mb-20 rounded-lg justify-center border-2 backdrop-blur-lg">
        <div className="">
          <div className="text-center text-stone-300">
            <img
              src="/Logo-my-hotel-app.png"
              className="mx-auto bg-"
              alt="LOGO"
              width={150}
            />
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome</h1>
            <p className="mt-4 w-96">Enter your email and password to log in.</p>
          </div>
          <br />
          <form onSubmit={Login} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="border w-full rounded-lg bg-white text-black border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  onChange={(e) => setPass(e.target.value)}
                  type={passwordVisible ? "text" : "password"}
                  className="border w-full bg-white text-black rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                />
                <span onClick={() => setPasswordVisible(!passwordVisible)} className="cursor-pointer absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </div>
            </div>
            {error && (
              <div className="bg-red-500 text-white p-1 w-45 rounded-md text-sm mt-3">{error}</div>
            )}
            {successMessage && (
              <div className="bg-green-500 text-white p-1 w-45 rounded-md text-sm mt-3">{successMessage}</div>
            )}
            <div>
              <button type="submit" className="rounded-lg bg-cyan-800 p-2 w-full text-sm font-medium text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}

export default Page;

