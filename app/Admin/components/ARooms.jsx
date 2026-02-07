"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NextImage from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CardSkeleton from '../../Components/Loading/CardSkeleton';

function ARooms({ setAdmin, theme }) {
  const [dataH, setdataH] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [editModal, setEditModal] = useState({ show: false, room: null });
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
        const res = await axios.get(`${API_URL}/api/rooms`);
        setdataH(res.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const openDeleteModal = (id) => {
    setDeleteModal({ show: true, id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null });
  };

  const confirmDelete = async () => {
    setDeletingId(deleteModal.id);
    try {
      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
      await axios.delete(`${API_URL}/api/admin/rooms/${deleteModal.id}`, {
        withCredentials: true
      });
      setdataH(prevRooms => prevRooms.filter(room => room._id !== deleteModal.id));
      toast.success("Room deleted successfully", {
        position: "top-center",
        autoClose: 3000
      });
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error("Failed to delete room: " + (error.response?.data?.message || error.message), {
        position: "top-center"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (room) => {
    setEditModal({ show: true, room });
    setPreviewImage(room.imageUrl);
  };

  const closeEditModal = () => {
    setEditModal({ show: false, room: null });
    setPreviewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(formRef.current);

    try {
      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
      await axios.put(`${API_URL}/api/admin/rooms/${editModal.room._id}`, formData, {
        withCredentials: true
      });

      const res = await axios.get(`${API_URL}/api/rooms`);
      setdataH(res.data);

      toast.success("Room updated successfully!", {
        position: "top-center",
        autoClose: 3000
      });
      closeEditModal();
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error("Failed to update room: " + (error.response?.data?.message || error.message), {
        position: "top-center"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Theme Helpers
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "bg-slate-900" : "bg-gray-50",
    card: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-custom",
    text: isDark ? "text-white" : "text-gray-900",
    textSoft: isDark ? "text-gray-400" : "text-gray-600",
    modalBg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
    modalOverlay: isDark ? "bg-black/70" : "bg-black/30",
    btnCancel: isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800",
    borderTop: isDark ? "border-slate-700" : "border-gray-100",
    iconColor: isDark ? "text-amber-400" : "text-orange-500",
    btnEdit: isDark ? "bg-slate-700 hover:bg-slate-600 text-blue-400 hover:text-blue-300" : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700",
    btnDelete: isDark ? "bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/50" : "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-transparent"
  };

  return (
    <>
      <div className={`p-8 min-h-screen animate-fadeIn transition-colors duration-300 ${colors.bg}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            Manage Rooms
          </h1>
          <button
            onClick={() => setAdmin('AddRoom')}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-orange-500/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => <CardSkeleton key={i} theme={isDark ? "dark" : "light"} />)
          ) : (
            dataH.map((rm) => (
              <div key={rm._id} className={`rounded-2xl transition-all duration-300 overflow-hidden group border hover:shadow-2xl hover:scale-[1.02] ${colors.card}`}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <NextImage
                    src={rm.imageUrl}
                    alt={rm.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg z-10">
                    ${rm.prix}/night
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-bold text-lg line-clamp-1 ${colors.text}`}>{rm.name}</h3>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${colors.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className={`flex gap-4 text-sm mb-4 ${colors.textSoft}`}>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {rm.capacity} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {rm.type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-3 pt-2 border-t ${colors.borderTop}`}>
                    <button
                      onClick={() => openEditModal(rm)}
                      className={`flex-1 py-2 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${colors.btnEdit}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(rm._id)}
                      disabled={deletingId === rm._id}
                      className={`flex-1 py-2 disabled:opacity-50 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${colors.btnDelete}`}
                    >
                      {deletingId === rm._id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-400"></div>
                          <span>Wait...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal - Compact Version */}
      {editModal.show && editModal.room && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${colors.modalOverlay}`}>
          <div className={`rounded-xl shadow-2xl max-w-4xl w-full border max-h-[95vh] overflow-y-auto animate-scaleIn ${colors.modalBg}`}>
            <div className={`p-4 border-b ${colors.borderTop}`}>
              <h3 className={`text-lg font-bold ${colors.text}`}>Edit Room</h3>
            </div>

            <form ref={formRef} onSubmit={handleUpdate} className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left Side: Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${colors.textSoft}`}>Name</label>
                    <input defaultValue={editModal.room.name} name="name" type="text" className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`} required />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${colors.textSoft}`}>Description</label>
                    <textarea defaultValue={editModal.room.description} name="description" rows="3" className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${colors.textSoft}`}>Type</label>
                      <select defaultValue={editModal.room.type} name="type" className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`} required>
                        <option value="Single" className="text-gray-900">Single</option>
                        <option value="Double" className="text-gray-900">Double</option>
                        <option value="Suite" className="text-gray-900">Suite</option>
                        <option value="Extended" className="text-gray-900">Extended</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${colors.textSoft}`}>Capacity</label>
                      <input defaultValue={editModal.room.capacity} name="capacity" type="number" className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`} required />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${colors.textSoft}`}>Price ($)</label>
                    <input defaultValue={editModal.room.prix} name="prix" type="number" step="0.01" className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`} required />
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="space-y-3">
                  <label className={`block text-xs font-semibold mb-1 ${colors.textSoft}`}>Room Image</label>
                  <div className={`border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center min-h-[150px] ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-gray-300 bg-gray-50'}`}>
                    {previewImage ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden">
                        <NextImage src={previewImage} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <span className={`text-sm ${colors.textSoft}`}>No image selected</span>
                    )}
                  </div>
                  <input type="file" name="image" accept="image/*" onChange={handleImageChange} className={`w-full text-xs ${colors.textSoft}`} />
                </div>
              </div>

              <div className={`flex justify-end gap-3 mt-4 pt-3 border-t ${colors.borderTop}`}>
                <button type="button" onClick={closeEditModal} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${colors.btnCancel}`}>Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-4 py-1.5 text-sm bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
                  {isUpdating ? <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span> : null}
                  {isUpdating ? 'Updating...' : 'Update Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <h3 className={`text-xl font-bold text-center mb-2 ${colors.text}`}>Delete Room?</h3>
              <p className={`text-center mb-6 ${colors.textSoft}`}>Are you sure you want to delete this room? This action cannot be undone.</p>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${colors.btnCancel}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {deletingId !== null ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      <ToastContainer />
    </>
  );
}

export default ARooms;
