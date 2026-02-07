"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "../context/UserContext";

function Contact() {
    const router = useRouter();
    const { user } = useUser();
    const [subject, setSubject] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch user's messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!user?.id) {
                setIsLoadingMessages(false);
                return;
            }

            try {
                const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
                const response = await axios.get(
                    `${API_URL}/api/contact/user`,
                    { withCredentials: true }
                );
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [user]);

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
                await axios.delete(`${API_URL}/api/contact/user/all`, {
                    withCredentials: true
                });
                setMessages([]);
                toast.success("All messages deleted successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else {
                await axios.delete(`${API_URL}/api/contact/user/${deleteModal.id}`, {
                    withCredentials: true
                });
                setMessages(prevMessages => prevMessages.filter(m => m._id !== deleteModal.id));
                toast.success("Message deleted successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message', {
                position: "top-center",
                autoClose: 2000,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePostContact = async (e) => {
        e.preventDefault();

        if (!subject || !msg) {
            toast.error("Please fill in all fields", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!user?.id) {
            toast.error("Please login to send a message", {
                position: "top-center",
                autoClose: 3000,
            });
            setTimeout(() => router.push("/auth/Login"), 1500);
            return;
        }

        setIsLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
            const response = await axios.post(
                `${API_URL}/api/contact`,
                { user: user.id, subject, message: msg },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            toast.success("Message sent successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setSubject("");
            setMsg("");
            // Add new message to the list
            setMessages(prev => [response.data, ...prev]);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.", {
                position: "top-center",
                autoClose: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <p className="text-orange-600 font-semibold text-sm uppercase tracking-wider mb-2">Get In Touch</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Contact <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">For Any Query</span>
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-orange-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Booking</h3>
                                    <p className="text-sm text-gray-600">book@Hotel.app</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-orange-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Technical</h3>
                                    <p className="text-sm text-gray-600">tech@Hotel.app</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-orange-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">General</h3>
                                    <p className="text-sm text-gray-600">info@Hotel.app</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Contact Section */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Map */}
                        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-orange-100">
                            <iframe
                                className="w-full h-full min-h-[400px]"
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13413.497715884776!2d-13.19815!3d27.154256!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc37731e21ffd02f%3A0xb5d8ba3b30a4a46b!2sH%C3%B4tel%20Al%20Massira!5e0!3m2!1sen!2sbd!4v1643685191346!5m2!1sen!2sbd"
                                frameBorder="0"
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex="0"
                            ></iframe>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-orange-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handlePostContact} className="space-y-5">
                                {/* Name & Email (Read-only) */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            value={user?.name || ""}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 cursor-not-allowed"
                                            placeholder="Please login"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 cursor-not-allowed"
                                            placeholder="Please login"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">Subject</label>
                                        <span className={`text-xs ${subject.length >= 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {subject.length}/100
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="What's this about?"
                                        maxLength={100}
                                        className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">Message</label>
                                        <span className={`text-xs ${msg.length >= 1000 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {msg.length}/1000
                                        </span>
                                    </div>
                                    <textarea
                                        value={msg}
                                        onChange={(e) => setMsg(e.target.value)}
                                        placeholder="Tell us more..."
                                        rows="5"
                                        maxLength={1000}
                                        className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !user?.id}
                                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : !user?.id ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Please Login to Send
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {!user?.id && (
                                    <p className="text-center text-sm text-gray-600">
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => router.push("/auth/Login")}
                                            className="text-orange-600 font-semibold hover:underline"
                                        >
                                            Login here
                                        </button>
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* My Messages Section */}
                    {user?.id && (
                        <div className="mt-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">My Messages</h2>
                                {messages.length > 0 && (
                                    <button
                                        onClick={() => openDeleteModal(null, 'all')}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete All
                                    </button>
                                )}
                            </div>

                            {isLoadingMessages ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
                                </div>
                            ) : messages.length > 0 ? (
                                <div className="grid gap-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message._id}
                                            className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 border border-orange-100 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3 gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1 break-all">{message.subject}</h3>
                                                    <p className="text-xs text-gray-500">{formatDate(message.createdAt || message.created_at)}</p>
                                                </div>
                                                <button
                                                    onClick={() => openDeleteModal(message._id, 'single')}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 flex-shrink-0"
                                                    title="Delete message"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="text-gray-700 bg-orange-50/50 p-4 rounded-lg border border-orange-100/50 w-full overflow-hidden">
                                                <p className="whitespace-pre-wrap break-all">{message.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-12 text-center border border-orange-100">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-gray-600">No messages sent yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
                                    <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                                    <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-gray-700">
                                {deleteModal.type === 'all'
                                    ? 'Are you sure you want to delete all your messages? This will permanently remove all messages you have sent.'
                                    : 'Are you sure you want to delete this message? This action cannot be undone.'}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Yes, Delete
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

            <ToastContainer />
        </>
    );
}

export default Contact;
