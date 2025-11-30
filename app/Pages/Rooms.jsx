"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import Link from 'next/link';

// Skeleton Loader Component
const RoomSkeletonLoader = () => (
  <div className="bg-white rounded-md shadow-md border pb-4 animate-pulse">
    <nav className="relative">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-t-md"></div>
      {/* Price tag skeleton */}
      <span className="absolute -mt-4 ml-4 px-2 py-1 bg-gray-300 text-sm text-transparent rounded-md w-24 h-6"></span>
    </nav>
    <div className="px-5">
      {/* Room name skeleton */}
      <div className="pt-4 flex justify-between text-xl font-bold mb-3">
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
      </div>
      {/* Amenities skeleton */}
      <div className="flex space-x-3 text-gray-800">
        <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
      </div>
      {/* Buttons skeleton */}
      <div className="flex justify-between mt-5">
        <div className="p-2 rounded-md bg-gray-200 h-10 w-28"></div>
        <div className="p-2 rounded-md bg-gray-200 h-10 w-28"></div>
      </div>
    </div>
  </div>
);

function Rooms() {
  const router = useRouter();
  const [dataH, setdataH] = useState([]);
  const [fil, setFil] = useState("");
  const [loading, setLoading] = useState(true);

  const star = <img src="star.png" alt="star.png" width={22} height={11} />;
  const bed = <img src="sleeping.png" alt="star.png" width={22} height={11} />;
  const wifi = <img src="wifi.png" alt="star.png" width={22} height={11} />;
  const bath = <img src="bathtub.png" alt="star.png" width={22} height={11} />;

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Rooms`)
      .then((res) => {
        setdataH(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      });
  }, []);

  const RoomsImages = [
    "./rooms/r1.jpg",
    "./rooms/r2.jpg",
    "./rooms/r3.jpg",
    "./rooms/r4.jpg",
    "./rooms/r5.jpg",
    "./rooms/r6.jpg",
    "./rooms/r7.jpg",
    "./rooms/r8.jpg",
  ];

  return (
    <div className="pb-10">
      <div className="w-full h-full mt-6 text-center pb-5">
        <div className="text-amber-400 mb-2 text-xl font-bold">__---- OUR ROOMS ----__</div>
        <div className="md:text-4xl text-3xl text-black font-bold">Explore Our <span className="text-amber-400 ">ROOMS</span></div>
      </div>
      <div className="text-center space-x-2 text-black mb-5">
        <button onClick={() => { setFil("") }} className={`${fil === "" ? "bg-yellow-400" : ""} p-3 rounded-md`}>ALL</button>
        <button onClick={() => { setFil("Single") }} className={`${fil === "Single" ? "bg-yellow-400" : ""} p-3 rounded-md`}>SINGLE</button>
        <button onClick={() => { setFil("Double") }} className={`${fil === "Double" ? "bg-yellow-400" : ""} p-3 rounded-md`}>DOUBLE</button>
        <button onClick={() => { setFil("Extended") }} className={`${fil === "Extended" ? "bg-yellow-400" : ""} p-3 rounded-md`}>EXTENDED</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mx-7 md:mx-16 ">
        {loading ? (
          // Render multiple skeleton loaders while loading
          Array.from({ length: 6 }).map((_, index) => (
            <RoomSkeletonLoader key={index} />
          ))
        ) : (
          (fil === "" ? dataH : dataH.filter((flt) => flt.type === fil)).map((rm, i) => (
            <div className="bg-white rounded-md shadow-md border pb-4" key={i} >
              <nav className="relative">
                <img src={RoomsImages[i % RoomsImages.length]} alt={rm.name} className="w-full h-48 object-cover rounded-md" />
                <span className="absolute -mt-4 ml-4 px-2 py-1 bg-amber-500 text-sm text-white rounded-md">{rm.prix}$/night</span>
              </nav>
              <div className="px-5">
                <p className="pt-4 flex justify-between text-black text-xl font-bold mb-3">{rm.name}
                  <span className="flex gap-1">{star}{star}{star}{star}{star}</span>
                </p>
                <div className="flex space-x-3 text-gray-800">
                  <span className="flex gap-1 items-center ">{bed} {rm.capacity} bed |</span>
                  <span className="flex gap-1 items-center ">{bath} {rm.capacity} Bath |</span>
                  <span className="flex gap-1 items-center ">{wifi} Wifi </span>
                </div>
                <div className="flex justify-between mt-5">
                  <Link href={`/Rooms/${rm._id}?r=${RoomsImages[i % RoomsImages.length].split("/")[2]}`}>
                    <button className="p-2 rounded-md hover:scale-105 duration-150 bg-yellow-500 text-white">VIEW DETAIL</button>
                  </Link>
                  <Link href={`/Rooms/${rm._id}?r=${RoomsImages[i % RoomsImages.length].split("/")[2]}`}>
                    <button className="p-2 rounded-md hover:scale-105 duration-150 bg-black text-white">BOOK NOW</button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rooms;