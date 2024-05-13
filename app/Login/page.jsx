"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
// import { useRouter } from "next/navigation";
import {useSession} from  "next-auth/react"
import SignInWithGoogle from "../Pages/SignInWithGoogle";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function page() {
  const [email, setEmail] = useState("@hotel.app");
  const [pass, setPass] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ereur, setEreur] = useState("");
  const [goodCreat, setgoodCreat] = useState("");
  const {data,status}=useSession()


  const Login = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      // setEreur("Email and password are required.");
      toast("Email and password are required.", {
        type: "error", // Can be 'success', 'error', 'info', etc.
        position: "top-center", // Adjust position as needed
        autoClose: 3000, // Milliseconds before auto-dismissal
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXTAUTH_URL}/api/auth/login`,
        {
          email,
          pass,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("User Login successfully:", data);
        setEmail("");
        setPass("");
        toast("User Login successfully.", {
          type: "success", // Can be 'success', 'error', 'info', etc.
          position: "top-center", // Adjust position as needed
          autoClose: 3000, // Milliseconds before auto-dismissal
        });
        localStorage.setItem("accessToken", data.accessToken); // Set accessToken in localStorage
        localStorage.setItem("nameuser", data.name);
        window.location.assign("/HomePage");
      } else {
        console.error(
          "Login failed. Server returned:",
          response.status,
          response.statusText
        );
        // setEreur("");
        toast("Invalid credentials. Please try again.", {
          type: "error", // Can be 'success', 'error', 'info', etc.
          position: "top-center", // Adjust position as needed
          autoClose: 3000, // Milliseconds before auto-dismissal
        }); // Update the error state correctly
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast("Invalid credentials. Please try again.", {
        type: "error", // Can be 'success', 'error', 'info', etc.
        position: "top-center", // Adjust position as needed
        autoClose: 3000, // Milliseconds before auto-dismissal
      }); // Update the error state correctly
    }
  };

  return (
    <div style={{backgroundImage: `url('image.jpg')`}}
     className="flex items-center  justify-center  text-black -mt-20 ">
      <section className=" flex items-center px-10 py-7 mt-[108px] mb-20   rounded-lg justify-center border-2 backdrop-blur-lg ">
        <div className="">
          <div className=" text-center text-stone-300">
            <img
              src="/Logo-my-hotel-app.png"
              className="mx-auto bg-"
              alt="LOGO"
              width={150} 
            />
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome </h1>

            <p className="mt-4  w-96">
              Enter your email and password to log in.
            </p>
          </div>
          <br />
            <form action="" onSubmit={Login} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="relative ">
                  <input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    type="email"
                    className="border w-full rounded-lg bg-white text-black border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter email"
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              {/*  password */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
                    type={passwordVisible ? "text" : "password"}
                    className="border w-full bg-white text-black rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter password"
                  />
                  <span onClick={() => setPasswordVisible(!passwordVisible)} className="cursor-pointer absolute inset-y-0 end-0 grid place-content-center px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              {/* Ereur */}
              <h6
                className={`bg-red-500 text-white p-1 w-45 rounded-md text-sm mt-3 ${
                  ereur ? "block" : "hidden"
                }`}
              >
                {ereur}
              </h6>
              {/* GOOD */}
              <h6
                className={`bg-green-500 text-white p-1 w-45 rounded-md text-sm mt-3 ${
                  goodCreat ? "block" : "hidden"
                }`}
              >
                {goodCreat}
              </h6>

              <div className="">
                <button
                  type="submit"
                  className=" rounded-lg bg-cyan-800 p-2 w-full text-sm font-medium text-white"
                >
                  Login
                </button>
                
              </div>
              <div className="flex items-center justify-between">
              <p className="text-sm text-white ">
                  <h6>No account?</h6>
                  <Link className="underline text-blue-500" href="/Register">
                    {" "}
                    Create an account
                  </Link> 
                </p>
               <SignInWithGoogle />
              </div>
              
            </form><br />
            
          
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}

export default page;
