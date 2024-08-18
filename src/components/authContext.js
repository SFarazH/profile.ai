"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const verifyUser = async () => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        credentials: "include", 
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("User ID:", data.userId);
        setAuthUser(data);
        console.log("auth func updated");
      } else {
        console.log("Verification failed:", data.message);
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    verifyUser();
  }, []);

  const value = {
    authUser,
    setAuthUser,
    isLoading,
    verifyUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
