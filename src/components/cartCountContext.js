"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count", {
        credentials: "include",
      });
      const data = await response.json();
      // console.log(data, "cart data");
      setCartCount(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const value = {
    cartCount,
    fetchCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
