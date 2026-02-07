"use client";
import { useUser } from "../context/UserContext";
import Admin from "./components/Admin";

function Page() {
  const { user } = useUser();

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 transform transition-all hover:scale-105 duration-300">
          <div className="mx-auto mb-6 bg-red-100 w-20 h-20 rounded-full flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Access Denied</h1>
          <p className="text-gray-500 mb-6 text-lg">
            You do not have permission to view this page. <br />
            <span className="text-sm">Please contact an administrator if you believe this is an error.</span>
          </p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-md transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Return to Home
          </a>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Admin />
    </div>
  );
}

export default Page;
