"use client"
import { FolderDot, LogOut, Sun, Moon } from "../../Components/lucide-react";
import React, { useState, useEffect } from "react";
import ARooms from "./ARooms";
import ABooking from "./ABooking";
import AContact from "./AContact";
import AddRoom from "./AddRoom";
import AUsers from "./AUsers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/UserContext";

function Admin() {
  const [Admin, setAdmin] = useState("ROOMS");
  const [theme, setTheme] = useState("dark"); // Default to dark for premium look
  const {logout } = useUser();

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
  };

  const AdminPages = () => {
    switch (Admin) {
      case "ROOMS":
        return <ARooms Admin={Admin} setAdmin={setAdmin} theme={theme} />;
      case "BOOKING":
        return <ABooking theme={theme} />;
      case "CONTACT":
        return <AContact theme={theme} />;
      case "USERS":
        return <AUsers theme={theme} />;
      case "AddRoom":
        return <AddRoom Admin={Admin} setAdmin={setAdmin} theme={theme} />;
      default:
        return null;
    }
  };

  const menuItems = [
    { id: "ROOMS", label: "Rooms", icon: "🏨" },
    { id: "BOOKING", label: "Bookings", icon: "📅" },
    { id: "CONTACT", label: "Messages", icon: "✉️" },
    { id: "USERS", label: "Users", icon: "👥" }
  ];

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col shadow-2xl transition-colors duration-300`}>
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center justify-between ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3 mb-4 transition-colors`}>
            <div className="flex items-center gap-2">
              <FolderDot className="w-5 h-5" />
              <span className="font-bold text-sm">Admin Panel</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-md transition-all duration-300 hover:scale-110"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className={`w-full py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${theme === 'dark'
                ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setAdmin(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-3 ${Admin === item.id
                  ? "bg-orange-500 text-white shadow-lg transform scale-105"
                  : theme === 'dark'
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>EdHotel Admin v1.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {AdminPages()}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Admin;
