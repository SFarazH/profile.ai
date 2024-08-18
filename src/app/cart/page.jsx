"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authContext";
import CartItem from "@/components/CartItem";
import axios from "axios";

export default function Cart() {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const getCartDetails = async () => {
    const cartResponse = await axios.get("/api/cart/get");
    const cartItems = cartResponse.data.items;

    const productPromises = cartItems.map(async (item) => {
      try {
        const productResponse = await axios.get(
          `https://fakestoreapi.com/products/${item.productId}`
        );
        return {
          ...item,
          product: productResponse.data,
        };
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
        return {
          ...item,
          product: {}, // Provide default values if the product fetch fails
        };
      }
    });

    // Wait for all product details to be fetched
    const cartItemsWithDetails = await Promise.all(productPromises);
    setCartItems(cartItemsWithDetails);
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  useEffect(() => {
    getCartDetails();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!authUser) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    }
  }, [authUser, isLoading, router]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1>Your Cart</h1>

      <div className="bg-white px-4 py-6 sm:px-8 sm:py-10 w-full lg:w-2/3 mx-auto">
        {cartItems.map((item) => (
          <CartItem
            key={item.productId}
            data={item}
            onQuantityChange={updateCartItemQuantity}
          />
        ))}
      </div>
    </div>
  );
}
