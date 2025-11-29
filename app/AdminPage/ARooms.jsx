"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

function ARooms({ setAdmin }) {
  const [dataH, setdataH] = useState([]);
  const star = <img src="star.png" alt="star.png" width={15} height={11} />;
  const bed = <img src="sleeping.png" alt="star.png" width={15} height={11} />;
  const wifi = <img src="wifi.png" alt="star.png" width={15} height={11} />;
  const bath = <img src="bathtub.png" alt="star.png" width={15} height={11} />;

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Rooms`)
      .then((res) => setdataH(res.data))
      .catch((error) => console.error('Error fetching rooms:', error));
  }, []);

  const DeleteById = async (roomId) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URl}/Rooms/${roomId}`);
        const updatedRooms = dataH.filter(room => room._id !== roomId);
        setdataH(updatedRooms);
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  return (
    <div className="pb-10">
      <div className=" w-full h-full mt-6 text-center pb-5 flex justify-between">
        <h1 className="text-4xl ml-16 text-black font-bold">
          Our <span className="text-amber-400">ROOMS</span>
        </h1>
        <button onClick={() => { setAdmin('AddRoom') }} className="text-2xl mr-16 text-black font-bold bg-amber-400 p-1 rounded-md">
          + Room
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-4 mx-7 md:mx-16">
        {dataH.map((rm, i) => (
          <div className="bg-white rounded-md shadow-md border pb-4" key={i}>
            <nav className="relative">
              <img src={rm.imageUrl} alt={rm.name} className="w-full rounded-md" />
              <span className="absolute -mt-4 ml-4 px-2 py-1 bg-amber-500 text-sm text-white rounded-md">{rm.prix}$/night</span>
            </nav>
            <div className="px-5">
              <p className="pt-4 flex justify-between text-black text-[18px] font-bold mb-3">
                {rm.name} 
                <span className="flex gap-1">{star}{star}{star}{star}{star}</span> 
              </p>
              <div className="flex space-x-3 text-gray-800">
                <span className="flex gap-1 items-center">{bed} {rm.capacity} bed |</span>
                <span className="flex gap-1 items-center">{bath} {rm.capacity} Bath |</span>
                <span className="flex gap-1 items-center">{wifi} Wifi</span>
              </div>
              <div className="flex justify-between mt-5">
                <Link href={`/Admin/${rm._id}`}><button className="p-2 rounded-md hover:scale-105 duration-150 bg-yellow-500 text-white">PUT</button></Link>
                <button onClick={() => DeleteById(rm._id)} className="p-2 rounded-md hover:scale-105 duration-150 bg-black text-white">DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ARooms;
