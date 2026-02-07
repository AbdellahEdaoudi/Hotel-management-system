"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays, parseISO } from "date-fns";
import Image from "next/image";
import { useUser } from "../../context/UserContext";
import Header from "../../Pages/Header";

function Page() {
  const router = useRouter();
  const { user, logout, token } = useUser();
  console.log(token);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const star = <Image src="/star.png" alt="star" width={18} height={9} />
  const bed = <Image src="/sleeping.png" alt="bed" width={18} height={9} />
  const wifi = <Image src="/wifi.png" alt="wifi" width={18} height={9} />
  const bath = <Image src="/bathtub.png" alt="bath" width={18} height={9} />
  const [room, setRoom] = useState({});
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!params?.RoomId) return;
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms/${params.RoomId}`)
      .then(res => {
        setRoom(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params.RoomId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please register/login to book a room", { position: "top-center" });
      setTimeout(() => router.push("/auth/Register"), 1500);
      return;
    }

    setIsBooking(true);
    const checkInDateObj = parseISO(checkInDate);
    const checkOutDateObj = parseISO(checkOutDate);
    const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
    // Calculate total price: room price × number of nights
    const prixTotal = daysDifference > 0 ? room.prix * daysDifference : 0;

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates.", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false);
      return;
    }

    const myDate = new Date();
    myDate.setHours(0, 0, 0, 0);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn < myDate || checkOut < myDate) {
      toast.error("Please select dates in the future", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false);
      return;
    }

    if (checkOut < checkIn) {
      toast.error("Your selected check-out date must be after the check-in date", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking`,
        { user: user.id, room: room._id, prix: prixTotal, check_in: checkInDate, check_out: checkOutDate },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      toast.success("Booking successful", { type: "success", position: "top-center", autoClose: 1000 });
      setTimeout(() => {
        router.push("/Booking");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Date is invalid", { type: "error", position: "top-center", autoClose: 3000 });
      } else {
        console.error(error);
        toast.error("An error occurred. Please try again.", { type: "error", position: "top-center", autoClose: 3000 });
      }
    } finally {
      setIsBooking(false);
    }
  };

  const checkInDateObj = parseISO(checkInDate);
  const checkOutDateObj = parseISO(checkOutDate);
  const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);

  if (isLoading) {
    return (
      <div>
        <div className="sticky top-0 z-50">
          <Header page="Rooms" />
        </div>
        <div className="min-h-screen flex items-start justify-center pt-40 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 font-medium text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50">
        <Header page="Rooms" />
      </div>
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-2 px-2 sm:px-4 flex md:pt-5">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Room Details Card - Takes up 4/7 columns */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <div className="bg-white/95 backdrop-blur-md border border-orange-200/20 rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/20 flex-grow flex flex-col">
                <div className="relative h-48 sm:h-64 overflow-hidden group">
                  {room.imageUrl && (
                    <Image
                      src={room.imageUrl}
                      alt={room.name || "Room"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {room.prix && (
                    <div className="absolute top-3 left-3 bg-gradient-to-br from-orange-400 to-orange-600 px-3 py-1 rounded-full shadow-md z-10">
                      <span className="text-white font-bold text-lg">${room.prix}</span>
                      <span className="text-white text-xs ml-1">/night</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent truncate">
                      {room.name}
                    </h1>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="transform hover:scale-125 transition-transform duration-300 hover:rotate-6">{star}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3 p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium hover:scale-105 transition-transform">
                      <span>{bed}</span>
                      <span>{room.capacity} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium hover:scale-105 transition-transform">
                      <span>{bath}</span>
                      <span>{room.capacity} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium hover:scale-105 transition-transform">
                      <span>{wifi}</span>
                      <span>WiFi</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-l-2 border-orange-500 shadow-sm flex-grow overflow-auto max-h-40">
                    <h3 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm leading-snug">{room.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Card - Takes up 3/7 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white/95 backdrop-blur-md border border-orange-200/20 rounded-xl shadow-lg overflow-hidden h-full">
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-3 text-center">
                  <h2 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Your Stay
                  </h2>
                </div>

                <form onSubmit={handleBooking} className="p-4 space-y-3 text-black">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.name}
                        placeholder="Name"
                        readOnly
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        placeholder="email@example.com"
                        readOnly
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-2 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none focus:shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-2 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none focus:shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 rounded-lg border border-green-200 flex justify-between items-center">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Total</label>
                      {daysDifference > 0 && (
                        <p className="text-xs text-gray-500">{daysDifference} night{daysDifference > 1 ? 's' : ''}</p>
                      )}
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ${daysDifference > 0 ? (room.prix * daysDifference).toFixed(2) : '0.00'}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-white font-bold text-base shadow-md bg-gradient-to-br from-orange-500 to-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={isBooking}
                  >
                    {isBooking ? "Processing..." : user ? "BOOK NOW" : "Register to Book"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}

export default Page;