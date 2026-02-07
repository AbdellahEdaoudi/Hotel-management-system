"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Access localStorage only on the client side
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

            // Get token from cookies
            const accessToken = Cookies.get('accessToken');
            console.log('🔑 Token from cookies:', accessToken);
            setToken(accessToken || null);
        }
    }, []);

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "/";
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
