"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ABooking({ theme }) {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Theme Helpers
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "bg-slate-900" : "bg-gray-50",
    card: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-xl",
    text: isDark ? "text-white" : "text-gray-900",
    textSoft: isDark ? "text-gray-400" : "text-gray-600",
    inputBg: isDark ? "bg-slate-800 border-slate-700 text-gray-300" : "bg-white border-gray-300 text-gray-900",
    tableHeader: isDark ? "bg-slate-700/50 text-gray-400" : "bg-gray-100 text-gray-600",
    tableRowHover: isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50",
    divide: isDark ? "divide-slate-700" : "divide-gray-200",
    modalBg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
    modalOverlay: isDark ? "bg-black/70" : "bg-black/30",
    btnCancel: isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
  };

  const fetchBookings = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
      const response = await axios.get(`${API_URL}/api/admin/bookings`, {
        withCredentials: true
      });
      setBookings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    fetchBookings();
    const intervalId = setInterval(fetchBookings, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const openDeleteModal = (id, type) => {
    setDeleteModal({ show: true, id, type });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, type: null });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.type === 'all') {
        // Using loop for safety since I didn't verify a bulk delete endpoint in adminController yet
        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
        const deletePromises = bookings.map(b =>
          axios.delete(`${API_URL}/api/admin/bookings/${b._id}`, {
            withCredentials: true
          })
        );
        await Promise.all(deletePromises);
        setBookings([]);
      } else {
        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
        await axios.delete(`${API_URL}/api/admin/bookings/${deleteModal.id}`, {
          withCredentials: true
        });
        setBookings(prev => prev.filter(b => b._id !== deleteModal.id));
      }
      closeDeleteModal();
      toast.success(deleteModal.type === 'all' ? "All bookings cancelled successfully" : "Booking cancelled successfully", {
        position: "top-center"
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error("Failed to cancel booking", { position: "top-center" });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const userName = booking.user?.name || booking.nameC || '';
    const userEmail = booking.user?.email || booking.email || '';
    const roomName = booking.room?.name || booking.nameR || '';

    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  if (!mounted || isLoading) {
    return (
      <div className={`flex justify-center items-center py-20 ${colors.bg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`p-8 min-h-screen animate-fadeIn transition-colors duration-300 ${colors.bg}`}>
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            Manage Bookings
          </h1>
          <div className="flex gap-3">
            <input
              type="search"
              placeholder="Search bookings..."
              className={`px-4 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all ${colors.inputBg}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {bookings.length > 0 && (
              <button
                onClick={() => openDeleteModal(null, 'all')}
                className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-900/50 text-sm font-semibold rounded-lg transition-all"
              >
                Cancel All
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length > 0 ? (
          <div className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${colors.card}`}>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${colors.divide}`}>
                <thead className={colors.tableHeader}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Room</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Check-in</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Check-out</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${colors.divide}`}>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className={`transition-colors duration-200 ${colors.tableRowHover}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className={`font-medium text-sm ${colors.text}`}>{booking.user?.name || booking.nameC || 'N/A'}</p>
                          <p className="text-gray-500 text-xs">{booking.user?.email || booking.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${colors.textSoft}`}>{booking.room?.name || booking.nameR || 'N/A'}</td>
                      <td className={`px-6 py-4 text-sm ${colors.textSoft}`}>
                        {booking.check_in ? format(new Date(booking.check_in), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className={`px-6 py-4 text-sm ${colors.textSoft}`}>
                        {booking.check_out ? format(new Date(booking.check_out), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-500">${booking.prix || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${booking.status === 'paid' ? (isDark ? 'bg-green-900/50 text-green-400 border border-green-900' : 'bg-green-100 text-green-700 border border-green-200') :
                          booking.status === 'cancelled' ? (isDark ? 'bg-red-900/50 text-red-400 border border-red-900' : 'bg-red-100 text-red-700 border border-red-200') :
                            (isDark ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-900' : 'bg-yellow-100 text-yellow-700 border border-yellow-200')
                          }`}>
                          {(booking.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openDeleteModal(booking._id, 'single')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${isDark ? "bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border-red-900/50" : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"}`}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl shadow-xl border p-12 text-center transition-colors duration-300 ${colors.card}`}>
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className={`text-lg ${colors.textSoft}`}>No bookings found</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${colors.modalOverlay}`}>
          <div className={`rounded-2xl shadow-2xl max-w-sm w-full border animate-scaleIn ${colors.modalBg}`}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 ${colors.text}`}>Cancel Booking?</h3>
              <p className={`text-center mb-6 ${colors.textSoft}`}>
                {deleteModal.type === 'all'
                  ? 'Are you sure you want to cancel ALL bookings? This cannot be undone.'
                  : 'Are you sure you want to cancel this booking?'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${colors.btnCancel}`}
                >
                  Keep
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}

export default ABooking;
