import React from "react";
import { FaXmark } from "react-icons/fa6";
import { useCart } from "./cartCountContext";
import axios from "axios";

const CartItem = ({ data, onQuantityChange, setTemp }) => {
  const { fetchCartCount } = useCart();
  const updateQuantity = async (productId, action) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, action }),
      });

      const result = await response.json();
      fetchCartCount();
      console.log(result);

      onQuantityChange(
        productId,
        action === "increment" ? data.quantity + 1 : data.quantity - 1
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleIncrement = () => {
    updateQuantity(data.productId, "increment");
  };

  const handleDecrement = () => {
    if (data.quantity > 1) {
      updateQuantity(data.productId, "decrement");
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const response = await axios.delete("/api/cart/delete", {
        data: { productId },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      console.log(data);

      if (data.message === "Item removed from cart") {
        setTemp((p) => p + 1);
        fetchCartCount();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0 border-b-2 border-black">
      <div className="shrink-0 w-28">
        <img
          className="h-28 w-fit max-w-full rounded-lg object-cover flex justify-between"
          src={data.product.image}
          alt=""
        />
      </div>

      <div className="relative flex flex-1 flex-col justify-between">
        <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
          <div className="pr-8 sm:pr-5">
            <p className="text-base font-semibold text-gray-900">
              {data.product.title}
            </p>
          </div>

          <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
            <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
              ${data.product.price}
            </p>

            <div className="sm:order-1">
              <div className="mx-auto flex h-8 items-stretch text-gray-600">
                <button
                  disabled={data.quantity === 1}
                  onClick={handleDecrement}
                  className={`${
                    data.quantity === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white`}
                >
                  -
                </button>
                <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">
                  {data.quantity}
                </div>
                <button
                  onClick={handleIncrement}
                  className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => removeItemFromCart(data.productId)}
          className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto cursor-pointer"
        >
          <FaXmark size={30} color="red" />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
