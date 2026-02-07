"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { differenceInDays, format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../context/UserContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function Booking() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: null });
  const [viewModal, setViewModal] = useState({ show: false, booking: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
        if (error.response?.status === 401) {
          router.push("/auth/Login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

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
        // Clear all bookings
        setBookings([]);
      } else {
        await axios.delete(`${API_URL}/api/booking/${deleteModal.id}`, {
          withCredentials: true
        });
        // Remove the deleted booking from state
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== deleteModal.id));
      }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting booking:', error);
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
    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    return differenceInDays(checkOutDate, checkInDate);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('ticket-content');
    if (!element) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable cross-origin for images
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const userName = viewModal.booking.user?.name || user?.name || 'Guest';
      // Keep spaces, remove only invalid filename characters
      const safeUserName = userName.replace(/[^a-zA-Z0-9 ]/g, '');
      pdf.save(`Ticket - ${safeUserName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF. Please try printing instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = (booking) => {
    const printWindow = window.open('', '_blank');
    const nights = calculateNights(booking.check_in, booking.check_out);
    const checkInFormatted = format(parseISO(booking.check_in), "MMM dd, yyyy", { locale: enUS });
    const checkOutFormatted = format(parseISO(booking.check_out), "MMM dd, yyyy", { locale: enUS });

    printWindow.document.write(`
      <html>
        <head>
          <title>Reservation - ${booking._id}</title>
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #f97316; }
            .invoice-title { font-size: 32px; font-weight: bold; color: #333; margin: 0; }
            .status-badge { background-color: #dcfce7; color: #166534; padding: 5px 15px; border-radius: 9999px; font-weight: bold; font-size: 14px; text-transform: uppercase; border: 1px solid #bbf7d0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .section-title { font-size: 14px; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-item { margin-bottom: 5px; }
            .info-label { font-weight: bold; color: #555; width: 100px; display: inline-block; }
            .total-section { margin-top: 30px; border-top: 2px solid #eee; pt-4; text-align: right; }
            .total-label { font-size: 18px; font-weight: bold; margin-right: 15px; }
            .total-amount { font-size: 28px; font-weight: bold; color: #f97316; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://res.cloudinary.com/dcnhvlyyu/image/upload/v1770466639/uploads/psl34dkdhtherqiboqy1.png" alt="EdHotel Logo" style="height: 60px; max-width: 200px; object-fit: contain;" />
              <div class="status-badge">PAID</div>
            </div>
            
            <div style="margin-bottom: 40px;">
              <h1 class="invoice-title">Reservation Confirmation</h1>
              <p style="color: #666; margin-top: 5px;">Booking Reference: #${booking._id.slice(-8).toUpperCase()}</p>
            </div>

            <div class="grid">
              <div>
                <div class="section-title">Guest Details</div>
                <div class="info-item"><span class="info-label">Name:</span> ${booking.user?.name || user?.name || 'Guest'}</div>
                <div class="info-item"><span class="info-label">Email:</span> ${booking.user?.email || user?.email || 'N/A'}</div>
                <div class="info-item"><span class="info-label">Date:</span> ${format(new Date(), "MMM dd, yyyy")}</div>
              </div>
              <div>
                <div class="section-title">Stay Details</div>
                <div class="info-item"><span class="info-label">Check-in:</span> ${checkInFormatted}</div>
                <div class="info-item"><span class="info-label">Check-out:</span> ${checkOutFormatted}</div>
                <div class="info-item"><span class="info-label">Duration:</span> ${nights} Night(s)</div>
              </div>
            </div>

            <div style="margin-bottom: 30px;">
              <div class="section-title">Room Information</div>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 5px 0; font-size: 18px;">${booking.room?.name || 'Room'}</h3>
                <p style="margin: 0; color: #666;">${booking.room?.type || 'Standard Room'}</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">${booking.room?.description || ''}</p>
              </div>
            </div>

            <div class="total-section">
              <span class="total-label">Total Amount Paid:</span>
              <span class="total-amount">$${booking.prix}</span>
            </div>

            <div class="footer">
              <p>Thank you for choosing EdHotel!</p>
              <p>123 Hotel Street, City, Country | +1 234 567 890 | support@edhotel.com</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {bookings.length > 0 ? (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6 justify-end">
                <button
                  onClick={() => openDeleteModal(null, 'all')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Cancel All
                </button>
                {getTotal() > 0 && (
                  <button
                    onClick={() => router.push(`/Checkout?amount=${getTotal()}&type=all`)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay All Unpaid (${getTotal()})
                  </button>
                )}
              </div>

              {/* Bookings Stats - Compact */}
              <div className="flex flex-wrap items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-center px-4 border-r border-gray-100 last:border-0">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Total</p>
                    <p className="text-lg font-bold text-gray-800 leading-none">{bookings.length}</p>
                  </div>
                  <div className="text-center px-4 border-r border-gray-100 last:border-0">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Unpaid</p>
                    <p className="text-lg font-bold text-orange-600 leading-none">{bookings.filter(b => b.status === 'pending').length}</p>
                  </div>
                  <div className="text-center px-4 border-r border-gray-100 last:border-0">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Paid</p>
                    <p className="text-lg font-bold text-green-600 leading-none">{bookings.filter(b => b.status === 'paid').length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <span className="text-xs font-semibold text-blue-700">Remaining Limit:</span>
                  <span className="text-sm font-bold text-blue-800">{Math.max(0, 5 - bookings.filter(b => b.status === 'pending').length)}</span>
                </div>
              </div>

              {/* Bookings Grid */}
              <div className="grid gap-6">
                {bookings
                  .sort((a, b) => {
                    // Sort pending first, then by date
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                  })
                  .map((booking, index) => {
                    const nights = calculateNights(booking.check_in, booking.check_out);
                    const checkInFormatted = format(parseISO(booking.check_in), "MMM dd, yyyy", { locale: enUS });
                    const checkOutFormatted = format(parseISO(booking.check_out), "MMM dd, yyyy", { locale: enUS });
                    const bookingRef = booking._id.slice(-8).toUpperCase();

                    return (
                      <div
                        key={booking._id || index}
                        className={`relative bg-white/95 backdrop-blur-md border rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${booking.status === 'paid'
                          ? 'border-green-200 shadow-green-500/5'
                          : 'border-orange-200 shadow-orange-500/5'
                          }`}
                      >
                        <div className="md:flex">
                          {/* Room Image */}
                          <div className="md:w-1/3 relative h-48 md:h-auto">
                            {booking.room?.imageUrl ? (
                              <Image
                                src={booking.room.imageUrl}
                                alt={booking.room.name || "Room"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                                <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </div>
                            )}
                            {/* Status Badge - More Prominent */}
                            <div className="absolute top-0 left-0">
                              {booking.status === 'paid' ? (
                                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-sm flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  PAID
                                </div>
                              ) : (
                                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-sm">
                                  PENDING PAYMENT
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="md:w-2/3 p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold text-gray-800">
                                    {booking.room?.name || 'Room'}
                                  </h3>
                                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                    #{bookingRef}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {booking.room?.type || 'Standard Room'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                  ${booking.prix}
                                </p>
                                <p className="text-xs text-gray-500">Total</p>
                              </div>
                            </div>

                            {/* Dates Section */}
                            <div className="grid md:grid-cols-2 gap-3 mb-3">
                              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs font-semibold text-gray-600">CHECK-IN</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">{checkInFormatted}</p>
                              </div>
                              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs font-semibold text-gray-600">CHECK-OUT</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">{checkOutFormatted}</p>
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                <span className="font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-medium">{booking.user?.name || user?.name || 'Guest'}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-3 mt-4">
                              {booking.status !== 'paid' && (
                                <button
                                  onClick={() => router.push(`/Checkout?amount=${booking.prix}&bookingId=${booking._id}`)}
                                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                  Pay Now
                                </button>
                              )}
                              <button
                                onClick={() => openDeleteModal(booking._id, 'single')}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Reservation
                              </button>
                              {booking.status === 'paid' && (
                                <button
                                  onClick={() => setViewModal({ show: true, booking })}
                                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                  </svg>
                                  View Ticket
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg text-center max-w-md">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
                <p className="text-gray-600 text-sm mb-5">You haven't made any reservations. Start exploring our amazing rooms!</p>
                <Link
                  href="/Rooms"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Browse Rooms
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View/Print Invoice Modal */}
      {viewModal.show && viewModal.booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 transform transition-all animate-scaleIn flex flex-col max-h-[90vh]">

            {/* Modal Header / Toolbar */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Booking Ticket
              </h3>
              <button onClick={() => setViewModal({ show: false, booking: null })} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - The Invoice Preview */}
            <div className="p-8 overflow-y-auto bg-gray-100/50 flex-1">
              <div id="ticket-content" className="bg-white p-10 shadow-lg max-w-3xl mx-auto border border-gray-100 min-h-[600px]">
                {/* Invoice Header */}
                <div className="flex justify-between items-center border-b-2 border-orange-500 pb-6 mb-8">
                  <img
                    src="https://res.cloudinary.com/dcnhvlyyu/image/upload/v1770466639/uploads/psl34dkdhtherqiboqy1.png"
                    alt="EdHotel Logo"
                    className="h-16 object-contain"
                  />
                  <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold border border-green-200 uppercase tracking-wide">
                    PAID
                  </div>
                </div>

                {/* Invoice Title */}
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Ticket</h1>
                  <p className="text-gray-500">Booking Reference: <span className="font-mono text-gray-700">#{viewModal.booking._id.slice(-8).toUpperCase()}</span></p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-10 mb-10">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Guest Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex"><span className="w-24 font-bold text-gray-600">Name:</span> <span>{viewModal.booking.user?.name || user?.name || 'Guest'}</span></div>
                      <div className="flex"><span className="w-24 font-bold text-gray-600">Email:</span> <span>{viewModal.booking.user?.email || user?.email || 'N/A'}</span></div>
                      <div className="flex"><span className="w-24 font-bold text-gray-600">Date:</span> <span>{format(new Date(), "MMM dd, yyyy")}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Stay Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex"><span className="w-24 font-bold text-gray-600">Check-in:</span> <span>{format(parseISO(viewModal.booking.check_in), "MMM dd, yyyy", { locale: enUS })}</span></div>
                      <div className="flex"><span className="w-24 font-bold text-gray-600">Check-out:</span> <span>{format(parseISO(viewModal.booking.check_out), "MMM dd, yyyy", { locale: enUS })}</span></div>
                      <div className="flex"><span className="w-24 font-bold text-gray-600">Duration:</span> <span>{calculateNights(viewModal.booking.check_in, viewModal.booking.check_out)} Night(s)</span></div>
                    </div>
                  </div>
                </div>

                {/* Room Info */}
                <div className="mb-10">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Room Information</h4>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{viewModal.booking.room?.name || 'Room'}</h3>
                    <p className="text-sm text-gray-600 mb-3">{viewModal.booking.room?.type || 'Standard Room'}</p>
                    <p className="text-sm text-gray-500 italic">{viewModal.booking.room?.description || ''}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-100 pt-6 text-right">
                  <span className="text-lg font-bold text-gray-600 mr-4">Total Amount Paid:</span>
                  <span className="text-3xl font-bold text-orange-600">${viewModal.booking.prix}</span>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-xs text-gray-400 border-t pt-8">
                  <p className="mb-1">Thank you for choosing EdHotel!</p>
                  <p>123 Hotel Street, City, Country | +1 234 567 890 | support@edhotel.com</p>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0 z-10">
              <button
                onClick={() => setViewModal({ show: false, booking: null })}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-700"></div>
                    Downloading Ticket...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={() => handlePrint(viewModal.booking)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scaleIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm Cancellation</h3>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700">
                {deleteModal.type === 'all'
                  ? 'Are you sure you want to cancel all your bookings? This will remove all pending reservations from your account.'
                  : 'Are you sure you want to cancel this booking? You will lose your reservation for this room.'}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Yes, Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Booking;
