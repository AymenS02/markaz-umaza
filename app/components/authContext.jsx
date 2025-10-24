"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read once during render — not inside useEffect
  const storedUser = typeof window !== "undefined" 
    ? localStorage.getItem("user") 
    : null;

  const [user, setUser] = useState(() => storedUser ? JSON.parse(storedUser) : null);
  const [loading, setLoading] = useState(!storedUser);

  useEffect(() => {
    // If you ever need to sync with changes from another tab:
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
