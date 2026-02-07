"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import CardSkeleton from '../Components/Loading/CardSkeleton';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);

  const star = <Image src="/star.png" alt="star" width={22} height={11} style={{ width: "auto", height: "auto" }} />;
  const bed = <Image src="/sleeping.png" alt="bed" width={22} height={11} style={{ width: "auto", height: "auto" }} />;
  const wifi = <Image src="/wifi.png" alt="wifi" width={22} height={11} style={{ width: "auto", height: "auto" }} />;
  const bath = <Image src="/bathtub.png" alt="bath" width={22} height={11} style={{ width: "auto", height: "auto" }} />;

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
        const res = await axios.get(`${API_URL}/api/rooms`);
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="pb-10">
      <div className="w-full h-full mt-6 text-center pb-5">
        <div className="text-amber-400 mb-2 text-xl font-bold">__---- OUR ROOMS ----__</div>
        <div className="md:text-4xl text-3xl text-black font-bold">Explore Our <span className="text-amber-400 ">ROOMS</span></div>
      </div>
      <div className="text-center space-x-2 text-black mb-5">
        <button onClick={() => { setFilterType("") }} className={`${filterType === "" ? "bg-yellow-400" : ""} p-3 rounded-md transition duration-200 hover:bg-yellow-300`}>ALL</button>
        <button onClick={() => { setFilterType("Single") }} className={`${filterType === "Single" ? "bg-yellow-400" : ""} p-3 rounded-md transition duration-200 hover:bg-yellow-300`}>SINGLE</button>
        <button onClick={() => { setFilterType("Double") }} className={`${filterType === "Double" ? "bg-yellow-400" : ""} p-3 rounded-md transition duration-200 hover:bg-yellow-300`}>DOUBLE</button>
        <button onClick={() => { setFilterType("Extended") }} className={`${filterType === "Extended" ? "bg-yellow-400" : ""} p-3 rounded-md transition duration-200 hover:bg-yellow-300`}>EXTENDED</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mx-7 md:mx-16 ">
        {loading ? (
          // Render multiple skeleton loaders while loading
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : (
          (filterType === "" ? rooms : rooms.filter((room) => room.type === filterType)).map((room, i) => (
            <div className="bg-white rounded-md shadow-md border pb-4" key={i} >
              <nav className="relative h-48">
                <Image src={room.imageUrl} alt={room.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover rounded-t-md" />
                <span className="absolute bottom-0 left-4 px-2 py-1 bg-amber-500 text-sm text-white rounded-md z-10">{room.prix}$/night</span>
              </nav>
              <div className="px-5">
                <p className="pt-4 flex justify-between text-black text-xl font-bold mb-3">
                  <span className='line-clamp-1'>{room.name}</span>
                  <span className="flex gap-1">{star}{star}{star}{star}{star}</span>
                </p>
                <div className="flex space-x-3 text-gray-800">
                  <span className="flex gap-1 items-center ">{bed} {room.capacity} bed |</span>
                  <span className="flex gap-1 items-center ">{bath} {room.capacity} Bath |</span>
                  <span className="flex gap-1 items-center ">{wifi} Wifi </span>
                </div>
                <div className="flex justify-between mt-5">
                  <Link href={`/Rooms/${room._id}`}>
                    <button className="p-2 rounded-md hover:scale-105 duration-150 bg-yellow-500 text-white">VIEW DETAIL</button>
                  </Link>
                  <Link href={`/Rooms/${room._id}`}>
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