"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  // Lazy initializer reads localStorage synchronously on first client render.
  // Returns null during SSR so there is no hydration mismatch on the server.
  const [user, setUser] = useState(getStoredUser);
  // loading starts false: user is initialised synchronously, no async work needed.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync auth state across browser tabs
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
