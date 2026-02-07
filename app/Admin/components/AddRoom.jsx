"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';
import NextImage from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddRoom({ setAdmin, theme }) {
  const formRef = useRef(null);
  const [imageRoom, setImageRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  // Theme Helpers
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "bg-slate-900" : "bg-gray-50",
    card: isDark ? "bg-slate-800 border-slate-700" : "bg-white shadow-md",
    text: isDark ? "text-white" : "text-gray-900",
    label: isDark ? "text-gray-300" : "text-gray-700",
    inputBg: isDark ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-amber-500" : "bg-white border-gray-300 text-gray-900 focus:ring-orange-500",
    previewBg: isDark ? "bg-slate-700 border-slate-600" : "bg-gray-100 border-gray-300",
    btnBack: isDark ? "bg-slate-700 hover:bg-slate-600 text-gray-300" : "bg-gray-500 hover:bg-gray-600 text-white"
  };

  const PostRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current);
    try {
      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
      const response = await axios.post(`${API_URL}/api/admin/rooms`, formData, {
        withCredentials: true
      });
      toast.success("Room added successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
      formRef.current.reset();
      setImageRoom(null);
      // Redirect back to rooms after 1 second
      setTimeout(() => setAdmin('ROOMS'), 1000);
    } catch (error) {
      console.error('Error uploading room:', error);
      toast.error('Failed to add room. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageRoom(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={`p-6 min-h-screen transition-colors duration-300 ${colors.bg}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${colors.text}`}>
            Add New <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Room</span>
          </h1>
          <button
            onClick={() => setAdmin('ROOMS')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${colors.btnBack}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Rooms
          </button>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className={`rounded-lg p-6 border ${colors.card}`}>
            <form ref={formRef} onSubmit={PostRoom} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${colors.label}`}>Room Image</label>
                <input
                  onChange={handleImageChange}
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${colors.inputBg}`}
                />
              </div>

              {/* Room Name */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${colors.label}`}>Room Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Deluxe Ocean View"
                  required
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${colors.inputBg}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${colors.label}`}>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the room features..."
                  rows="3"
                  required
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none ${colors.inputBg}`}
                />
              </div>

              {/* Type & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${colors.label}`}>Room Type</label>
                  <select
                    name="type"
                    required
                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${colors.inputBg}`}
                  >
                    <option value="" className="text-gray-900">Select Type</option>
                    <option value="Single" className="text-gray-900">Single</option>
                    <option value="Double" className="text-gray-900">Double</option>
                    <option value="Suite" className="text-gray-900">Suite</option>
                    <option value="Extended" className="text-gray-900">Extended</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${colors.label}`}>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="2"
                    min="1"
                    required
                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${colors.inputBg}`}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${colors.label}`}>Price per Night ($)</label>
                <input
                  type="number"
                  name="prix"
                  placeholder="150"
                  min="0"
                  step="0.01"
                  required
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${colors.inputBg}`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Adding Room...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Room
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Image Preview */}
          <div className={`rounded-lg border p-6 ${colors.card}`}>
            <h3 className={`text-lg font-bold mb-4 ${colors.text}`}>Image Preview</h3>
            {imageRoom ? (
              <div className="relative w-full h-64">
                <NextImage
                  src={imageRoom}
                  alt="Room Preview"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setImageRoom(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed ${colors.previewBg}`}>
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No image selected</p>
                <p className="text-gray-400 text-xs mt-1">Upload an image to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme={isDark ? "dark" : "light"} />
    </>
  );
}

export default AddRoom;
