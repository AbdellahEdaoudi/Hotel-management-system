"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from "next/link";
import Image from "next/image";
import { MyContext } from "../context/Mycontext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function Booking() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const { user, setUser, toast } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: null });
  // We use this state to populate the hidden ticket for PDF generation
  const [pdfBooking, setPdfBooking] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Ref for the hidden ticket container
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
        const response = await axios.get(
          `${API_URL}/api/booking`,
          { withCredentials: true }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          const status = error.response.status;
          if (status === 401 || status === 403 || status === 404) {
            let msg = "Session expired. Please login again.";
            if (status === 404) msg = "User not found. Please login again.";
            if (status === 401) msg = "Authentication required. Please login.";
            localStorage.removeItem('user');
            setUser(null);
            if (toast) toast.error(msg);
            router.push('/auth/Login');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Watch for pdfBooking changes to trigger download
  useEffect(() => {
    if (pdfBooking && ticketRef.current) {
      generatePDF();
    }
  }, [pdfBooking]);

  const openDeleteModal = (id, type) => {
    setDeleteModal({ show: true, id, type });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, type: null });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
      if (deleteModal.type === 'all') {
        await axios.delete(`${API_URL}/api/booking/all`, {
          withCredentials: true
        });
        setBookings([]);
      } else {
        await axios.delete(`${API_URL}/api/booking/${deleteModal.id}`, {
          withCredentials: true
        });
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== deleteModal.id));
      }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting booking:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403 || status === 404) {
          router.push('/auth/Login');
          return;
        }
      }
      alert('Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTotal = () => {
    return bookings
      .filter(bk => bk.status === 'pending')
      .reduce((total, bk) => total + (bk.prix || 0), 0);
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    return differenceInDays(checkOutDate, checkInDate);
  };

  const initDownload = (booking) => {
    setPdfBooking(booking);
  };

  const generatePDF = async () => {
    const element = ticketRef.current;
    if (!element || !pdfBooking) return;

    setIsDownloading(true);

    // Small delay to ensure rendering of the new data in the hidden div
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800, // Fixed width for consistent output
        windowWidth: 1200, // Simulate decent screen size
        onclone: (clonedDoc) => {
          // Remove all stylesheets from the cloned document to prevent html2canvas 
          // from parsing Tailwind v4's modern CSS color functions (like lab/oklch) 
          // which causes it to crash. The ticket uses inline styles anyway.
          const styleElements = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styleElements.forEach(el => el.remove());
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const userName = pdfBooking.user?.name || user?.name || 'Guest';
      const safeUserName = userName.replace(/[^a-zA-Z0-9 ]/g, '');
      pdf.save(`Ticket - ${safeUserName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF.');
    } finally {
      setIsDownloading(false);
      setPdfBooking(null); // Reset after download
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6 px-4 md:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          {bookings.length > 0 ? (
            <>
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 sm:justify-end">
                <button
                  onClick={() => openDeleteModal(null, 'all')}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Cancel All
                </button>
                {getTotal() > 0 && (
                  <button
                    onClick={() => router.push(`/Checkout?amount=${getTotal()}&type=all`)}
                    className="w-full sm:w-auto px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay Unpaid (${getTotal()})
                  </button>
                )}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white px-4 py-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="text-center md:border-r border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Total</p>
                  <p className="text-xl font-bold text-gray-800 leading-none mt-1">{bookings.length}</p>
                </div>
                <div className="text-center md:border-r border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Unpaid</p>
                  <p className="text-xl font-bold text-orange-600 leading-none mt-1">{bookings.filter(b => b.status === 'pending').length}</p>
                </div>
                <div className="text-center md:border-r border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Paid</p>
                  <p className="text-xl font-bold text-green-600 leading-none mt-1">{bookings.filter(b => b.status === 'paid').length}</p>
                </div>
                <div className="text-center flex items-center justify-center">
                  <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-full max-w-[120px]">
                    <span className="block text-xs font-semibold text-blue-700">Limit</span>
                    <span className="block text-sm font-bold text-blue-800">{Math.max(0, 5 - bookings.filter(b => b.status === 'pending').length)} Left</span>
                  </div>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-6">
                {bookings
                  .sort((a, b) => {
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                  })
                  .map((booking, index) => {
                    const nights = calculateNights(booking.check_in, booking.check_out);
                    const checkInFormatted = booking.check_in ? format(parseISO(booking.check_in), "MMM dd, yyyy", { locale: enUS }) : 'N/A';
                    const checkOutFormatted = booking.check_out ? format(parseISO(booking.check_out), "MMM dd, yyyy", { locale: enUS }) : 'N/A';
                    const bookingRef = booking._id ? booking._id.slice(-8).toUpperCase() : 'REF';

                    return (
                      <div
                        key={booking._id || index}
                        className={`bg-white rounded-xl shadow-md overflow-hidden border transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row ${booking.status === 'paid' ? 'border-green-200' : 'border-orange-200'}`}
                      >
                        {/* Image Section */}
                        <div className="md:w-1/3 lg:w-1/4 relative h-48 md:h-auto overflow-hidden">
                          {booking.room?.imageUrl ? (
                            <Image
                              src={booking.room.imageUrl}
                              alt={booking.room.name || "Room"}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold text-white rounded-br-lg ${booking.status === 'paid' ? 'bg-green-600' : 'bg-orange-500'}`}>
                            {booking.status === 'paid' ? 'PAID' : 'PENDING'}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-800">{booking.room?.name || 'Room Name'}</h3>
                                <p className="text-sm text-gray-500">{booking.room?.type || 'Standard'}</p>
                              </div>
                              <div className="text-right">
                                <span className="block text-lg font-bold text-orange-600">${booking.prix}</span>
                                <span className="text-xs text-gray-400">Total Price</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="block text-xs font-bold text-gray-400 uppercase">Check In</span>
                                <span className="block text-sm font-semibold text-gray-700">{checkInFormatted}</span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="block text-xs font-bold text-gray-400 uppercase">Check Out</span>
                                <span className="block text-sm font-semibold text-gray-700">{checkOutFormatted}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {nights} Night(s)
                              </span>
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                                #{bookingRef}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-2">
                            {booking.status !== 'paid' ? (
                              <button
                                onClick={() => router.push(`/Checkout?amount=${booking.prix}&bookingId=${booking._id}`)}
                                className="flex-1 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Pay Now
                              </button>
                            ) : (
                              <button
                                onClick={() => initDownload(booking)}
                                disabled={isDownloading}
                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                              >
                                {isDownloading && pdfBooking?._id === booking._id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                )}
                                Download Ticket
                              </button>
                            )}

                            <button
                              onClick={() => openDeleteModal(booking._id, 'single')}
                              className="flex-1 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              Cancel Booking
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md w-full border border-gray-100">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
                <p className="text-gray-500 text-sm mb-6">Looks like you haven't made any reservations. Explore our rooms and book your stay today!</p>
                <Link
                  href="/Rooms"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Browse Rooms
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full top-1/2 left-1/2 p-6 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
              <p className="text-gray-500 text-sm mt-1">
                {deleteModal.type === 'all' ? 'This will cancel ALL your bookings.' : 'This will cancel this specific reservation.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={closeDeleteModal} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                No, Keep
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-md transition-colors flex items-center justify-center">
                {isDeleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Ticket Component for PDF Generation */
        pdfBooking && (
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div ref={ticketRef} style={{ backgroundColor: '#ffffff', color: '#1f2937', padding: '40px', width: '800px', border: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f97316', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                  {/* We use a simple text or local asset if image fails, but here we assume internet */}
                  <img src="https://res.cloudinary.com/dcnhvlyyu/image/upload/v1770851732/uploads/bggnstx3duhs70icf9vb.png" alt="Logo" style={{ height: '48px', width: 'auto' }} crossOrigin="anonymous" />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0, lineHeight: 1.2 }}>BOOKING TICKET</h1>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0 0 0' }}>#{pdfBooking._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', marginBottom: '30px' }}>
                <div style={{ width: '50%' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>Guest Info</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '0 0 5px 0', color: '#1f2937' }}>{pdfBooking.user?.name || user?.name || 'Guest'}</p>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>{pdfBooking.user?.email || user?.email}</p>
                </div>
                <div style={{ width: '50%' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>Reservation Info</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#4b5563', fontSize: '14px', display: 'inline-block', width: '90px' }}>Check-in:</span>
                    <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>{pdfBooking.check_in ? format(parseISO(pdfBooking.check_in), "MMM dd, yyyy") : 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#4b5563', fontSize: '14px', display: 'inline-block', width: '90px' }}>Check-out:</span>
                    <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>{pdfBooking.check_out ? format(parseISO(pdfBooking.check_out), "MMM dd, yyyy") : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Room Card in Ticket */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '24px', border: '1px solid #f3f4f6', marginBottom: '30px', display: 'flex' }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ea580c', margin: '0 0 8px 0' }}>{pdfBooking.room?.name}</h3>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151', margin: '0 0 12px 0' }}>{pdfBooking.room?.type}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{pdfBooking.room?.description?.substring(0, 150)}...</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <span style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 'bold', margin: '0 0 5px 0' }}>Price</span>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 10px 0' }}>${pdfBooking.prix}</span>
                  <span style={{ display: 'inline-block', fontSize: '12px', color: '#16a34a', fontWeight: 'bold', backgroundColor: '#dcfce3', padding: '4px 10px', borderRadius: '6px' }}>PAID</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 5px 0' }}>Thank you for choosing EdHotel.</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>If you have any questions, please contact support@edhotel.com</p>
              </div>
            </div>
          </div>
        )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </>
  );
}

export default Booking;
