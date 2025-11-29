"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays, parseISO } from "date-fns";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function Page({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const r = searchParams.get('r');
  const [isLoading, setIsLoading] = useState(true);
  const star = <Image src="/star.png" alt="star" width={22} height={11} />
  const bed = <Image src="/sleeping.png" alt="bed" width={22} height={11} />
  const wifi = <Image src="/wifi.png" alt="wifi" width={22} height={11} />
  const bath = <Image src="/bathtub.png" alt="bath" width={22} height={11} />
  const [roomImage, setRoomImage] = useState(r);
  const [rm, setrm] = useState({});
  const [nameC, setNameC] = useState("");
  const [email, setEmail] = useState("");
  const [nameR, setNameR] = useState('');
  const [prix, setPrix] = useState(0);
  const [check_in, setCheckIn] = useState('');
  const [check_out, setCheckOut] = useState('');
  const [Booking, setBooking] = useState([]);
  const [Paying, setPaying] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Rooms/${params.RoomId}`)
      .then(res => {
        setrm(res.data);
        setNameR(res.data.name);
        setPrix(res.data.prix);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params.RoomId]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Booking`)
      .then(res => setBooking(res.data));
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URl}/Checkout`)
      .then(res => setPaying(res.data));
  }, []);

  const PostBoking = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    const checkInDateObj = parseISO(check_in);
    const checkOutDateObj = parseISO(check_out);
    const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);
    const prixTotal = (isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference)) 
    < 0 ? 0 : (isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference));

    if (!check_in || !check_out) {
      toast.error("Please select both check-in and check-out dates.", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false);
      return;
    }

    const myDate = new Date();
    myDate.setHours(0, 0, 0, 0);
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (checkInDate < myDate || checkOutDate < myDate) {
      toast.error("Please select dates in the future", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false);
      return;
    }

    for (const bkinout of Booking) {
      if (bkinout.nameR === nameR) {
        const checkInDateB = new Date(bkinout.check_in);
        const checkOutDateB = new Date(bkinout.check_out);
        if (
          (checkInDate >= checkInDateB && checkInDate < checkOutDateB) ||
          (checkOutDate > checkInDateB && checkOutDate <= checkOutDateB) ||
          (checkInDate <= checkInDateB && checkOutDate >= checkOutDateB)
        ) {
          toast.error(`Room is already booked from ${checkInDateB.toDateString()} to ${checkOutDateB.toDateString()}.`, { type: "error", position: "top-center", autoClose: 3000 });
          setIsBooking(false);
          return;
        }
      }
    }

    for (const bkinout of Paying) {
      if (bkinout.nameR === nameR) {
        const checkInDateB = new Date(bkinout.check_in);
        const checkOutDateB = new Date(bkinout.check_out);
        if (
          (checkInDate >= checkInDateB && checkInDate < checkOutDateB) ||
          (checkOutDate > checkInDateB && checkOutDate <= checkOutDateB) ||
          (checkInDate <= checkInDateB && checkOutDate >= checkOutDateB)
        ) {
          toast.error(`Room is already booked from ${checkInDateB.toDateString()} to ${checkOutDateB.toDateString()}.`, { type: "error", position: "top-center", autoClose: 3000 });
          setIsBooking(false);
          return;
        }
      }
    }

    if (checkOutDate < checkInDate) {
      toast.error("Your selected check-out date must be after the check-in date", { type: "error", position: "top-center", autoClose: 3000 });
      setIsBooking(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URl}/Booking`,
        { nameC, email, nameR, prix: prixTotal, check_in, check_out },
        { headers: { "Content-Type": "application/json" } }
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

  const checkInDateObj = parseISO(check_in);
  const checkOutDateObj = parseISO(check_out);
  const daysDifference = differenceInDays(checkOutDateObj, checkInDateObj);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 146, 60, 0.2);
        }
        
        .input-modern {
          transition: all 0.3s ease;
        }
        
        .input-modern:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(249, 115, 22, 0.25);
          border-color: #f97316;
          outline: none;
        }
        
        .btn-gradient {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          transition: all 0.3s ease;
        }
        
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(249, 115, 22, 0.4);
        }
        
        .btn-gradient:active {
          transform: translateY(0);
        }
        
        .price-badge {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .room-card {
          transition: all 0.4s ease;
        }
        
        .room-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.2);
        }
        
        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 1rem 1rem 0 0;
        }
        
        .image-container img {
          transition: transform 0.6s ease;
        }
        
        .image-container:hover img {
          transform: scale(1.1);
        }
        
        .feature-icon {
          transition: all 0.3s ease;
        }
        
        .feature-icon:hover {
          transform: scale(1.2) rotate(5deg);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details Card */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden room-card">
              <div className="image-container">
                {roomImage && (
                  <img
                    src={roomImage}
                    alt={rm.name || "Room"}
                    className="w-full h-96 object-cover"
                  />
                )}
                {rm.prix && (
                  <div className="absolute top-6 left-6 price-badge px-6 py-3 rounded-full shadow-lg">
                    <span className="text-white font-bold text-xl">${rm.prix}</span>
                    <span className="text-white text-sm ml-1">/night</span>
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {rm.name}
                  </h1>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="feature-icon">{star}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="feature-icon">{bed}</span>
                    <span>{rm.capacity} Beds</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="feature-icon">{bath}</span>
                    <span>{rm.capacity} Baths</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="feature-icon">{wifi}</span>
                    <span>Free WiFi</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-orange-500 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Room Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{rm.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form Card */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-center">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Your Stay
                </h2>
                <p className="text-orange-100 mt-2">Reserve your perfect room</p>
              </div>

              <form onSubmit={PostBoking} className="p-6 space-y-5 text-black">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setNameC(e.target.value)}
                    className="input-modern w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-modern w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-white via-white to-gray-200 border-2 border-gray-200 rounded-xl focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input-modern w-full px-4 py-3 bg-gradient-to-r from-white via-white to-gray-200 border-2 border-gray-200 rounded-xl focus:border-orange-500"
                    required
                  />
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Total Price
                  </label>
                  <div className="text-3xl font-bold text-green-600">
                    ${(isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference)) < 0 ? 0 : (isNaN(daysDifference) ? 0 : (rm.prix * daysDifference === 0 ? rm.prix : (rm.prix * 2) * daysDifference))}
                  </div>
                  {daysDifference > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {daysDifference} night{daysDifference > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-gradient w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      BOOK NOW
                    </>
                  )}
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
  );
}

export default Page;