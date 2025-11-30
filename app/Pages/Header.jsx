"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Menu, X, User } from "lucide-react";

function Header() {
  const [menu, setMenu] = useState(false);
  const [link, setLink] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [nameuser, setNameuser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const intervalId = setInterval(() => {
        setEmail(localStorage.getItem("email"));
        const token = localStorage.getItem("accessToken");
        const name = localStorage.getItem("nameuser");
        setAccessToken(token);
        setNameuser(name);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nameuser");
    localStorage.removeItem("email");
    window.location.replace('/Login');
  };

  // Prevent hydration mismatch by not rendering user-specific content until mounted
  if (!mounted) {
    return (
      <header className="py-1 bg-slate-900 text-yellow-100 shadow-lg border rounded border-yellow-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="flex h-16 items-center justify-between">
            <Link className="flex items-center text-yellow- gap-2 " href="/">
              <img src={"/Images/logowb.png"} width={70} height={10} alt="Logo" />
              <p className="text-2xl font-bold">EdHotel</p>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="py-1 bg-slate-900 text-yellow-100 shadow-lg border-b border-yellow-100/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center  group" href="/">
            <img
              src={"/Images/logowb.png"}
              width={70}
              height={10}
              alt="Logo"
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent">
              EdHotel
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-medium">
              {["Home", "About", "Services", "Rooms", "Booking", "Contact"].map((item) => (
                <li key={item} className="relative group">
                  <Link
                    onClick={() => setLink(item)}
                    href={item === "Home" ? "/" : `/${item}`}
                    className={`transition-colors duration-300 ${link === item ? "text-amber-400" : "text-gray-300 hover:text-amber-400"
                      }`}
                  >
                    {item.toUpperCase()}
                  </Link>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full ${link === item ? "w-full" : ""}`}></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!accessToken ? (
              <div className="flex gap-3">
                <Link
                  href="/Login"
                  className="px-5 py-2 text-sm font-medium text-amber-400 border border-amber-400 rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/Register"
                  className="px-5 py-2 text-sm font-medium text-slate-900 bg-amber-400 rounded-full hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
                    {nameuser ? nameuser.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {nameuser}
                  </span>
                </div>
                <button
                  title="LogOut"
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all duration-300"
                  onClick={Logout}
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenu(!menu)}
              className="p-2 text-gray-300 hover:text-amber-400 transition-colors"
            >
              {menu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full bg-slate-900 border-b border-slate-800 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${menu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="px-4 py-6 space-y-4">
          <ul className="space-y-4 text-center">
            {["Home", "About", "Services", "Rooms", "Booking", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  onClick={() => {
                    setMenu(false);
                    setLink(item);
                  }}
                  href={item === "Home" ? "/" : `/${item}`}
                  className={`block text-lg font-medium transition-colors ${link === item ? "text-amber-400" : "text-gray-400 hover:text-amber-400"
                    }`}
                >
                  {item.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth */}
          {!accessToken ? (
            <div className="flex flex-col gap-3 mt-6 px-8">
              <Link
                onClick={() => setMenu(false)}
                href="/Login"
                className="w-full py-3 text-center text-amber-400 border border-amber-400 rounded-xl hover:bg-amber-400/10 transition-colors"
              >
                Login
              </Link>
              <Link
                onClick={() => setMenu(false)}
                href="/Register"
                className="w-full py-3 text-center text-slate-900 bg-amber-400 rounded-xl hover:bg-amber-300 transition-colors"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="mt-6 px-8 border-t border-slate-800 pt-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-lg">
                  {nameuser ? nameuser.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-lg font-medium text-gray-200">{nameuser}</span>
              </div>
              <button
                onClick={Logout}
                className="w-full py-3 flex items-center justify-center gap-2 text-red-400 border border-red-400/30 rounded-xl hover:bg-red-400/10 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
