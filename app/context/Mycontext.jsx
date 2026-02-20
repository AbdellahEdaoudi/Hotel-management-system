"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useToast } from "../Components/toast";
import { useRouter } from "next/navigation";
export const MyContext = createContext(null);

export function MyProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const toast = useToast();
    const router = useRouter();


    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    localStorage.removeItem("user");
                }
            }
        }
    }, []);

    // logout
    const logout = async () => {
        setIsLoggingOut(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://edhotelserver.vercel.app";
            await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
            toast.success("Logged out successfully");
            router.push('/auth/Login');
            localStorage.removeItem('user');
            Cookies.remove('jwt');
            Cookies.remove('accessToken');
            setUser(null);
        } catch (error) {
            Cookies.remove('jwt');
            Cookies.remove('accessToken');
            setUser(null);
            router.push('/auth/Login');

        } finally {
            setIsLoggingOut(false);
        }
    };

    const contextValue = {
        user, setUser, logout, toast, isLoggingOut
    };

    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
}
