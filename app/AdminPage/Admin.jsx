"use client";
import { FolderDot, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import ARooms from "./ARooms";
import ABooking from "./ABooking";
import APaying from "./APaying";
import AContact from "./AContact";
import AddRoom from "./AddRoom";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  const AdminStg = typeof window !== 'undefined' ? localStorage.getItem("admin") : null;
  const [Admin, setAdmin] = useState(AdminStg || "ROOMS");
  const router = useRouter();


  useEffect(() => {
    localStorage.setItem("admin", Admin);
  }, [Admin]);

  const Logout =  () => {
    localStorage.removeItem("accessTokenAdmin");
    router.push("/AdminLogin")
  };

  const AdminPages = () => {
    switch (Admin) {
      case "ROOMS":
        return (
          <div>
            <ARooms Admin={Admin} setAdmin={setAdmin} />
          </div>
        );
      case "BOOKING":
        return (
          <div>
            <ABooking />
          </div>
        );
      case "PAYING":
        return (
          <div>
            <APaying />
          </div>
        );
      case "CONTACT":
        return (
          <div>
            <AContact />
          </div>
        );
      case "AddRoom":
        return (
          <div>
            <AddRoom Admin={Admin} setAdmin={setAdmin} />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div  className="flex h-full border-b-2 ">
      <div className="flex flex-col bg-gray-800 p-4 md:w-auto w-1/2">
        <button className=" md:w-60 p-2 rounded-md font-medium  text-black py-4 mb-16 bg-white flex gap-2 items-center justify-around">
        <span title="LogOut "
                  className="bg-red-500 p-1 rounded-md text-white"
                  onClick={Logout}
                >
                  <LogOut />
          </span>
          <span className="flex gap-2"><FolderDot /> ADMIN PAGE </span>
        </button>
        
        <button
          onClick={() => setAdmin("ROOMS")}
          className={`${
            Admin === "ROOMS" ? "bg-white text-black" : "text-gray-400"
          } p-2 rounded-md font-medium w-full py-4 mb-7 `}
        >
          ROOMS
        </button>
        <button
          onClick={() => setAdmin("BOOKING")}
          className={`${
            Admin === "BOOKING" ? "bg-white text-black" : "text-gray-400"
          } p-2 rounded-md font-medium w-full py-4 mb-7`}
        >
          BOOKING
        </button>
        <button
          onClick={() => setAdmin("PAYING")}
          className={`${
            Admin === "PAYING" ? "bg-white text-black" : "text-gray-400"
          } p-2 rounded-md font-medium w-full py-4 mb-7`}
        >
          PAYING
        </button>
        <button
          onClick={() => setAdmin("CONTACT")}
          className={`${
            Admin === "CONTACT" ? "bg-white text-black" : "text-gray-400"
          } p-2 rounded-md font-medium w-full py-4 mb-7`}
        >
          CONTACT
        </button>
      </div>
      <div className="md:w-full  w-1/2">{AdminPages()}</div>
      <ToastContainer />
    </div>
  );
}

export default Admin;
