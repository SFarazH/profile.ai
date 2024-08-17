"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [temp, setTemp] = useState(0);
  
  const verifyUser = async () => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
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
  //   const verifyUser = async () => {
  //     const config = {
  //       url: `${process.env.REACT_APP_BACKEND_LINK}/auth/verify`,
  //       method: "get",
  //       withCredentials: true,
  //     };
  //     axios(config)
  //       .then((res) => setAuthUser(res.data))
  //       .catch((error) => {
  //         console.error(error);
  //         setAuthUser(null);
  //       })
  //       .finally(() => setIsLoading(false));
  //   };
  //   useEffect(() => {
  // verifyUser();
  //   }, []);

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
