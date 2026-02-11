"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MyContext } from '../../context/Mycontext';

function AUsers({ theme }) {
    const { toast, logout } = useContext(MyContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
            const response = await axios.get(`${API_URL}/api/admin/users`, {
                withCredentials: true
            });
            setUsers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response) {
                const status = error.response.status;
                if (status === 401 || status === 403 || status === 404) {
                    let msg = "Session expired. Please login again.";
                    if (status === 404) msg = "User not found. Please login again.";
                    if (status === 401) msg = "Authentication required. Please login.";
                    if (toast) toast.error(msg);
                    router.push('/auth/Login');

                }
            }
            setIsLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setIsEdit(true);
            setCurrentUser(user);
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            setPassword(""); // Password not shown
        } else {
            setIsEdit(false);
            setCurrentUser(null);
            setName("");
            setEmail("");
            setPassword("");
            setRole("user");
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || (!isEdit && !password)) {
            toast.error("Please fill all required fields");
            return;
        }

        const userData = { name, email, role };
        if (password) userData.password = password;

        setIsSubmitting(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
            if (isEdit) {
                await axios.put(`${API_URL}/api/admin/users/${currentUser._id}`, userData, {
                    withCredentials: true
                });
                toast.success("User updated successfully");
            } else {
                await axios.post(`${API_URL}/api/admin/users`, userData, {
                    withCredentials: true
                });
                toast.success("User created successfully");
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            if (error.response) {
                const status = error.response.status;
                if (status === 401 || status === 403 || status === 404) {
                    let msg = "Session expired. Please login again.";
                    if (status === 404) msg = "User not found. Please login again.";
                    if (status === 401) msg = "Authentication required. Please login.";
                    if (toast) toast.error(msg);
                    router.push('/auth/Login');
                    return;
                }
            }
            toast.error(error.response?.data?.message || "Failed to save user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
            await axios.delete(`${API_URL}/api/admin/users/${deleteModal.id}`, {
                withCredentials: true
            });
            toast.success("User deleted successfully");
            setDeleteModal({ show: false, id: null });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            if (error.response) {
                const status = error.response.status;
                if (status === 401 || status === 403 || status === 404) {
                    let msg = "Session expired. Please login again.";
                    if (status === 404) msg = "User not found. Please login again.";
                    if (status === 401) msg = "Authentication required. Please login.";
                    if (toast) toast.error(msg);
                    router.push('/auth/Login');
                    return;
                }
            }
            toast.error("Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    // Theme helpers
    const isDark = theme === "dark";
    const colors = {
        bg: isDark ? "bg-slate-900" : "bg-gray-50",
        card: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-md",
        text: isDark ? "text-white" : "text-gray-900",
        textSoft: isDark ? "text-gray-400" : "text-gray-500",
        inputBg: isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900",
        tableHeader: isDark ? "bg-slate-700/50 text-gray-400" : "bg-gray-100/80 text-gray-600",
        tableRowHover: isDark ? "hover:bg-slate-700/30" : "hover:bg-gray-50",
        divide: isDark ? "divide-slate-700" : "divide-gray-200",
        modalBg: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
        modalOverlay: isDark ? "bg-black/70" : "bg-black/30",
        btnCancel: isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
    };

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center h-screen ${colors.bg}`}>
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className={`flex md:flex-row flex-col overflow-hidden h-screen transition-colors duration-300 ${colors.bg}`}>
            <div className='overflow-auto p-8 w-full animate-fadeIn'>
                <div className="flex justify-between items-center mb-8">
                    <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600'>
                        Users Management
                    </h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-orange-500/30 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add User
                    </button>
                </div>

                <div className={`rounded-2xl p-6 border transition-colors duration-300 ${colors.card}`}>
                    <div className="overflow-x-auto">
                        <table className={`w-full text-left ${colors.textSoft}`}>
                            <thead className={`text-xs uppercase ${colors.tableHeader}`}>
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-lg">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 rounded-tr-lg text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${colors.divide}`}>
                                {users.map((user) => (
                                    <tr key={user._id} className={`transition-colors duration-200 ${colors.tableRowHover}`}>
                                        <td className={`px-6 py-4 font-medium flex items-center gap-3 ${colors.text}`}>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'admin'
                                                ? (isDark ? 'bg-purple-900/50 text-purple-300 border border-purple-700' : 'bg-purple-100 text-purple-800 border border-purple-200')
                                                : (isDark ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-gray-100 text-gray-600 border border-gray-200')
                                                }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 ${colors.textSoft}`}>{user.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className={`p-1.5 rounded-lg transition-all ${isDark ? "text-blue-400 hover:bg-blue-900/30 hover:text-blue-300" : "text-blue-600 hover:bg-blue-100"}`}
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: user._id })}
                                                    className={`p-1.5 rounded-lg transition-all ${isDark ? "text-red-400 hover:bg-red-900/30 hover:text-red-300" : "text-red-600 hover:bg-red-100"}`}
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit/Add Modal */}
            {showModal && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 ${colors.modalOverlay}`}>
                    <div className={`rounded-2xl w-full max-w-md border shadow-2xl overflow-hidden animate-scaleIn ${colors.modalBg}`}>
                        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <h3 className={`text-xl font-bold ${colors.text}`}>
                                {isEdit ? "Edit User" : "Add New User"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className={`${colors.textSoft} hover:${colors.text}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${colors.textSoft}`}>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 ${colors.inputBg}`}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${colors.textSoft}`}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 ${colors.inputBg}`}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${colors.textSoft}`}>Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 ${colors.inputBg}`}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${colors.textSoft}`}>
                                    {isEdit ? "New Password (Optional)" : "Password"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 pr-10 ${colors.inputBg}`}
                                        required={!isEdit}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 hover:${colors.text} ${colors.textSoft}`}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${colors.btnCancel}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Processing..." : (isEdit ? "Save Changes" : "Create User")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 ${colors.modalOverlay}`}>
                    <div className={`rounded-2xl w-full max-w-sm border p-6 shadow-2xl animate-scaleIn ${colors.modalBg}`}>
                        <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>Confirm Delete</h3>
                        <p className={`mb-6 ${colors.textSoft}`}>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${colors.btnCancel}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
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
        </div>
    );
}

export default AUsers;
