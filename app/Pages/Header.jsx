"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
function Header() {
  const [menu, setMenu] = useState(false);
  const [link, setLink] = useState("");
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  const nameuser = typeof window !== 'undefined' ? localStorage.getItem("nameuser") : null;
  

  const Logout = async () => {
    localStorage.removeItem("accessToken");
    window.location.replace('/Login');
  };
  
  

  return (
      <header className="bg-slate-900 py-1  text-yellow-100  shadow-lg border rounded border-yellow-100 ">
        <div className="mx-auto  px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="flex h-16 items-center justify-between">
              <Link className="flex items-center text-yellow- gap-2 " href="/">
                <img src={"/Logo-my-hotel-app.png"} width={70} height={10} />
                <p className="text-2xl font-bold  ">EdHotel</p>
              </Link>
              {/* LES LINK */}
            <div className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                  <li className=" hover:scale-125 hover:text-green-500  duration-200">
                    <Link onClick={()=>{setLink("Home")}} href={"/"} className={`
                    ${link === "Home" ? "text-green-500" : ""}`}>
                      HOME
                    </Link>
                  </li>
                  
                  <li className=" hover:scale-125 hover:text-green-500  duration-200">
                    <Link onClick={()=>{setLink("About")}} href={"/About"} className={`
                    ${link === "About" ? "text-green-500" : ""}`}>
                      ABOUT
                    </Link>
                  </li>
                  <li className=" hover:scale-125 hover:text-green-500  duration-200">
                    <Link onClick={()=>{setLink("Services")}} href={"/Services"} className={`
                    ${link === "Services" ? "text-green-500" : ""}`}>
                      SERVICES
                    </Link>
                  </li>
                  <li className=" hover:scale-125 hover:text-green-500  duration-200">
                    <Link onClick={()=>{setLink("Rooms")}} href={"/Rooms"} className={`
                    ${link === "Rooms" ? "text-green-500" : ""}`}>
                      ROOMS
                    </Link>
                  </li>
                  <li className=" hover:scale-125 hover:text-green-500  duration-200">
                    <Link onClick={()=>{setLink("BOOKING")}} href={"/Booking"} className={`
                    ${link === "BOOKING" ? "text-green-500" : ""}`}>
                      BOOKING
                    </Link>
                  </li>
                  <li className=" hover:scale-125 hover:text-green-500  duration-200">
                    <Link onClick={()=>{setLink("Contact")}} href={"/Contact"} className={`
                    ${link === "Contact" ? "text-green-500" : ""}`}>
                      CONTACT US
                    </Link>
                  </li>
                </ul>
            </div>
            {/* SignInWithGoogle */}
            {!accessToken ?  (
                    <Link
                      onClick={() => {
                        !menu ? setMenu(menu) : setMenu(!menu);
                      }}
                      className="rounded-md bg-cyan-800 px-5 py-2.5 text-sm font-medium text-white"
                      href="/Register"
                    >
                      Register
                    </Link>
            ): null}

                  {/* LOGOUT */}
            {accessToken ? (
              <div className="flex gap-2 items-center">
                <h1
                className="md:block hidden"
              >{`Welcom, ${nameuser}`}</h1>
                <button title="LogOut "
                  className="bg-red-500 p-1 rounded-md text-white"
                  onClick={Logout}
                >
                  <LogOut />
                </button>
                {accessToken ? null : <img className="rounded-full w-10 border-2 border-yellow-500" src={`${data.user?.image ? data.user?.image : ""}`} alt="" />}
              </div>
              
            ) : null}
            {/* ICON MENU MOBILE */}
              <div
                  onClick={() => {
                    !menu ? setMenu(!menu) : setMenu(!menu);
                  }}
                  className="block md:hidden"
                >
                  <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
              </div>
          </div>
        </div>
        {/* Navbar mobile */}
        <nav
          className={`duration-500 bg-white shadow-md border-2  overflow-hidden absolute w-full md:hidden z-10
          ${menu ? "max-h-52" : "max-h-0"} 
          ${menu ? "min-h-48" : "min-h-0"} 
             `}
        >
          <ul
            className={`${menu ? "block " : "hidden "}
            text-center space-y-3 py-5 text-sm shadow-lg md:hidden `}
          >
            <li>
              <Link
                onClick={() => {
                  !menu ? setMenu(!menu) : setMenu(!menu);
                  setLink("Home");
                }}
                className={`${link === "Home" ? "text-green-500" : ""} 
                  text-gray-500  hover:text-gray-500/75 `}
                href="/"
                
              >
                {" "}
                HOME{" "}
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  !menu ? setMenu(!menu) : setMenu(!menu);
                  setLink("About");
                }}
                className={`${link === "About" ? "text-green-500" : ""} 
                  text-gray-500  hover:text-gray-500/75 `}
                href="/About"
                
              >
                {" "}
                ABOUT{" "}
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  !menu ? setMenu(!menu) : setMenu(!menu);
                  setLink("Services");
                }}
                className={`${link === "Services" ? "text-green-500" : ""} 
                  text-gray-500  hover:text-gray-500/75 `}
                href="/Services"
                
              >
                {" "}
                SERVICES{" "}
              </Link>
            </li>

            <li>
              <Link
                onClick={() => {
                  !menu ? setMenu(!menu) : setMenu(!menu);
                  setLink("Rooms");
                }}
                className={`${link === "Rooms" ? "text-green-500" : ""} 
                  text-gray-500  hover:text-gray-500/75 `}
                href="/Rooms"
              >
                {" "}
                ROOMS{" "}
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  !menu ? setMenu(!menu) : setMenu(!menu);
                  setLink("BOOKING");
                }}
                className={`${link === "BOOKING" ? "text-green-500" : ""} 
                  text-gray-500  hover:text-gray-500/75 `}
                href="/Booking"
              >
                {" "}
                BOOKING{" "}
              </Link>
            </li>

            <li>
              <Link
                onClick={() => {
                  !menu ? setMenu(!menu) : setMenu(!menu);
                  setLink("Contact");
                }}
                className={`${link === "Contact" ? "text-green-500" : ""} 
                  text-gray-500  hover:text-gray-500/75 `}
                href="/Contact"
              >
                {" "}
                CONTACT US{" "}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
  );
}

export default Header;
