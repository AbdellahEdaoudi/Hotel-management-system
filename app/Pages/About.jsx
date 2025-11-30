"use client";
import React from 'react'
import { School, UsersRound, Users } from "lucide-react"
function About() {
  return (
    <div>
      {/* ABOUT */}
      <div className="flex flex-col-reverse md:flex md:flex-row-reverse mx-5 md:mx-32 py-16 justify-between items-center">
        <div className=" md:w-1/2   text-black">
          <div className="font-bold text-yellow-500 text-xl mb-4">__--- ABOUT US---__</div>
          <div className="text-4xl  mb-8 font-bold ">Welcome to <span className="text-yellow-500">EDHOTEL</span></div>
          <div className="mb-6 text-gray-600">
            In our application, we strive to provide a unique and distinctive
            experience to our valued guests. We pride ourselves on providing exceptional
            service and excellent facilities to ensure your comfort and well-being during your stay with us.
          </div>
          <div className="flex w-full justify-between mb-6 gap-2">
            <div className="w-full h-36  border-2 rounded-md flex flex-col items-center justify-center space-y-2 ">
              <span className="text-yellow-600"><School />    </span>
              <span className="text-3xl "> +164 </span><span>Rooms</span>
            </div>
            <div className="w-full h-36  border-2 rounded-md flex flex-col items-center justify-center space-y-2 ">
              <span className="text-yellow-600"><Users />     </span>
              <span className="text-3xl "> +78 </span><span>Staffs</span>
            </div>
            <div className="w-full h-36  border-2 rounded-md flex flex-col items-center justify-center space-y-2 ">
              <span className="text-yellow-600"><UsersRound /></span>
              <span className="text-3xl "> 4657 </span><span>Clients</span>
            </div>
          </div>
        </div>
        <div>
          <img src="about-1.jpg" alt="EdHotel Facilities and Services" className=" rounded-md md:mb-0 mb-8" />
        </div>
      </div>


    </div>
  )
}

export default About