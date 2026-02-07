"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AContact({ theme }) {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Theme Helpers
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "bg-slate-900" : "bg-gray-50",
    card: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-xl",
    text: isDark ? "text-white" : "text-gray-900",
    textSoft: isDark ? "text-gray-400" : "text-gray-600",
    inputBg: isDark ? "bg-slate-800 border-slate-700 text-gray-300" : "bg-white border-gray-300 text-gray-900",
    modalBg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
    modalOverlay: isDark ? "bg-black/70" : "bg-black/30",
    btnCancel: isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800",
    messageHover: isDark ? "hover:border-slate-600" : "hover:border-orange-200"
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/contacts`, {
        withCredentials: true
      });
      setContacts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    fetchContacts();
    const intervalId = setInterval(fetchContacts, 10000);
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
        // Currently backend adminController doesn't have deleteAll supported directly in this pass, 
        // I only added delete one by one. I should probably add delete all or loop.
        // Let's assume loop for safety or I update backend.
        // Actually, let's just loop for now to be safe with the endpoints I created.
        const deletePromises = contacts.map(c =>
          axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/contacts/${c._id}`, {
            withCredentials: true
          })
        );
        await Promise.all(deletePromises);
        setContacts([]);
      } else {
        await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/contacts/${deleteModal.id}`, {
          withCredentials: true
        });
        setContacts(prev => prev.filter(c => c._id !== deleteModal.id));
      }
      closeDeleteModal();
      toast.success("Message deleted successfully", { position: "top-center" });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error("Failed to delete message", { position: "top-center" });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const name = contact.user?.name || '';
    const email = contact.user?.email || '';
    const subject = contact.subject || '';

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
            Manage Messages
          </h1>
          <div className="flex gap-3">
            <input
              type="search"
              placeholder="Search messages..."
              className={`px-4 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all ${colors.inputBg}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {contacts.length > 0 && (
              <button
                onClick={() => openDeleteModal(null, 'all')}
                className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-900/50 text-sm font-semibold rounded-lg transition-all"
              >
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Messages Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <div key={contact._id} className={`rounded-xl border p-5 hover:shadow-2xl transition-all duration-300 group ${colors.card} ${colors.messageHover}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                        {(contact.user?.name || 'U')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-base truncate ${colors.text}`}>{contact.user?.name || 'Unknown'}</h3>
                        <p className={`text-sm truncate ${colors.textSoft}`}>{contact.user?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="ml-0 md:ml-16">
                      <p className="font-semibold text-amber-500 text-sm mb-2 break-all">{contact.subject}</p>
                      <div className={`text-sm ${colors.textSoft} bg-opacity-20 p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-orange-50'} overflow-hidden w-full`}>
                        <p className={`whitespace-pre-wrap break-all ${expandedMessage === contact._id ? '' : 'line-clamp-2'}`}>
                          {contact.message}
                        </p>
                      </div>
                      {contact.message && contact.message.length > 100 && (
                        <button
                          onClick={() => setExpandedMessage(expandedMessage === contact._id ? null : contact._id)}
                          className={`text-xs hover:underline mt-2 transition-colors font-medium ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                        >
                          {expandedMessage === contact._id ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className={`text-xs font-medium ${colors.textSoft}`}>
                      {contact.created_at || contact.createdAt
                        ? format(new Date(contact.created_at || contact.createdAt), 'MMM dd, yyyy HH:mm')
                        : 'N/A'}
                    </p>
                    <button
                      onClick={() => openDeleteModal(contact._id, 'single')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 border ${isDark ? "bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border-red-900/50" : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl border p-12 text-center shadow-xl transition-colors duration-300 ${colors.card}`}>
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className={`text-lg ${colors.textSoft}`}>No messages found</p>
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
              <h3 className={`text-xl font-bold text-center mb-2 ${colors.text}`}>Delete Message?</h3>
              <p className={`text-center mb-6 ${colors.textSoft}`}>
                {deleteModal.type === 'all'
                  ? 'Are you sure you want to delete ALL messages? This cannot be undone.'
                  : 'Are you sure you delete this message?'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${colors.btnCancel}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
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

export default AContact;
