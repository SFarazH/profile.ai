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
  const [subTotal, setSubTotal] = useState(0);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [temp, setTemp] = useState(0);

  const [discountAmt, setDiscountAmt] = useState(0);

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
          product: {},
        };
      }
    });

    const cartItemsWithDetails = await Promise.all(productPromises);
    setCartItems(cartItemsWithDetails);
    updateTotalPrice(cartItemsWithDetails);
  };

  const updateTotalPrice = (items) => {
    const subtotal = items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    setSubTotal(subtotal);
    const discount = subtotal > 60 && applyDiscount ? 0.1 : 0;
    setDiscountAmt(subtotal * discount);
  };

  useEffect(() => {
    getCartDetails();
  }, [temp]);

  useEffect(() => {
    if (!isLoading) {
      if (!authUser) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    }
  }, [authUser, isLoading, router]);

  useEffect(() => {
    updateTotalPrice(cartItems);
  }, [cartItems, applyDiscount]);

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    setTemp((prev) => prev + 1);
  };

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-white px-4 py-6 sm:px-8 sm:py-10 w-full lg:w-2/3 mx-auto">
        {cartItems.map((item) => (
          <CartItem
            key={item.productId}
            data={item}
            onQuantityChange={updateCartItemQuantity}
            setTemp={setTemp}
          />
        ))}

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="apply-discount"
              checked={applyDiscount && subTotal > 60}
              onChange={() => setApplyDiscount(!applyDiscount)}
              className="mr-2"
              disabled={subTotal < 60}
            />
            <label
              htmlFor="apply-discount"
              className={`${subTotal < 60 ? "text-gray-500" : "text-black"}`}
            >
              Apply 10% discount <br />
              <span className="text-sm">
                (Cart value should be greater than $60)
              </span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-12">
          <h2>Subtotal:</h2>
          <p>$ {subTotal.toFixed(2)}</p>
        </div>
        <div className="mt-4 flex justify-end gap-12">
          <h2>Discount:</h2>
          <p>$ {discountAmt.toFixed(2)}</p>
        </div>
        <div className="mt-4 text-lg flex justify-end gap-12 font-semibold">
          <h2>Final Price:</h2>
          <p>$ {(subTotal - discountAmt).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
