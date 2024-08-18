import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./cartCountContext";

const ProductCard = ({ data }) => {
  const { fetchCartCount } = useCart();

  const addToCart = async (productId) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, action: "increment" }),
      });

      const data = await response.json();
      console.log(data);


      fetchCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <>
      <div className="group my-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
        <div className="relative mt-3 flex mx-auto h-72 overflow-hidden rounded-xl">
          <img
            className="peer relative right-0 h-full object-cover top-0"
            src={data.image}
            alt="product image"
          />
        </div>
        <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl tracking-tight text-slate-900">
            {data.title}
          </h5>

          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold text-slate-900">
                ${data.price}
              </span>
            </p>
          </div>
          <div
            className="cursor-pointer flex relative bottom-0 items-center gap-4 justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-md font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={() => addToCart(data.id)}
          >
            <FaShoppingCart size={25} />
            Add to cart
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
