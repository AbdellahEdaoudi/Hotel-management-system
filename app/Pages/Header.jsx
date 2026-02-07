"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X, User } from "../Components/lucide-react";
import Image from "next/image";
import { useUser } from "../context/UserContext";

function Header({ page }) {
  const [menu, setMenu] = useState(false);
  const { user, logout } = useUser();

  return (
    <header className="py-1 bg-slate-900 text-yellow-100 shadow-lg border-b border-yellow-100/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center group gap-2" href="/">
            <Image
              src={"/Images/logowb.png"}
              width={70}
              height={10}
              alt="Logo"
              className="group-hover:scale-110 transition-transform duration-300 w-16 h-auto"
            />
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent block">
              EdHotel
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-medium">
              {["Home", "About", "Services", "Rooms", "Booking", "Contact"].map((item) => (
                <li key={item} className="relative group">
                  <Link
                    href={item === "Home" ? "/" : `/${item}`}
                    className={`transition-colors duration-300 ${page === item ? "text-amber-400" : "text-gray-300 hover:text-amber-400"
                      }`}
                  >
                    {item.toUpperCase()}
                  </Link>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full ${page === item ? "w-full" : ""}`}></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex gap-3">
                <Link
                  href="/auth/Login"
                  className="px-5 py-2 text-sm font-medium text-amber-400 border border-amber-400 rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/Register"
                  className="px-5 py-2 text-sm font-medium text-slate-900 bg-amber-400 rounded-full hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {user.name}
                  </span>
                </div>
                <button
                  title="LogOut"
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all duration-300"
                  onClick={logout}
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex items-center gap-3 mr-2">
                <Link
                  href="/auth/Login"
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/Register"
                  className="px-4 py-1.5 text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}

            {/* User Avatar on Mobile Header */}
            {user && (
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-bold shadow-lg border-2 border-slate-800">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
            )}

            <button
              onClick={() => setMenu(!menu)}
              className="p-2 text-gray-300 hover:text-amber-400 transition-colors relative z-50"
            >
              {menu ? <X size={28} className="text-white drop-shadow-md" /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown Style */}
      <div
        className={`md:hidden absolute w-full bg-slate-900 border-b border-slate-800 shadow-xl transition-all duration-300 ease-in-out overflow-hidden z-40 ${menu ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="px-4 py-6 space-y-4">
          <ul className="space-y-4 text-center">
            {["Home", "About", "Services", "Rooms", "Booking", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  onClick={() => {
                    setMenu(false);
                  }}
                  href={item === "Home" ? "/" : `/${item}`}
                  className={`block text-lg font-medium transition-colors ${page === item ? "text-amber-400" : "text-gray-400 hover:text-amber-400"
                    }`}
                >
                  {item.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth */}
          {!user ? (
            <div className="flex flex-col gap-3 mt-6 px-8">
              <Link
                onClick={() => setMenu(false)}
                href="/auth/Login"
                className="w-full py-3 text-center text-amber-400 border border-amber-400 rounded-xl hover:bg-amber-400/10 transition-colors"
              >
                Login
              </Link>
              <Link
                onClick={() => setMenu(false)}
                href="/auth/Register"
                className="w-full py-3 text-center text-slate-900 bg-amber-400 rounded-xl hover:bg-amber-300 transition-colors"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="mt-6 px-8 border-t border-slate-800 pt-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-lg font-medium text-gray-200">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMenu(false);
                }}
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
