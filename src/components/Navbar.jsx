"use client";
import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "./authContext";
import { useCart } from "./cartCountContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { cartCount } = useCart();
  const router = useRouter();
  const { authUser, setAuthUser } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const logout = async () => {
    console.log("logging out");
    try {
      await axios.get("/api/logout");
      router.push("/");
      setAuthUser(null);
      setIsNavbarOpen(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const MobileNavigation = () => (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-900 shadow-md w-full flex flex-col ">
      <span
        className="absolute top-4 right-4 cursor-pointer text-white"
        onClick={toggleNavbar}
      >
        <AiOutlineClose color="white" size="1.5em" />
      </span>
      <ul className="flex flex-col gap-4 font-medium text-white text-center justify-around mt-16">
        <li className={` flex items-center justify-center`}>
          {authUser ? (
            <button
              onClick={() => logout()}
              className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded shadow"
            >
              Logout
            </button>
          ) : (
            <Link onClick={()=>setIsNavbarOpen(false)} href="/auth">
              <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                Login
              </button>
            </Link>
          )}
        </li>
      </ul>
    </div>
  );

  return (
    <header className="flex justify-between items-center md:px-1 py-4 shadow-md fira sticky top-0 opacity-100 px-4 bg-neutral-900 z-50">
      <Link href="/">
        <h2 className="cursor-pointer font-bold flex items-center text-2xl  md:px-8 text-white">
          profile.ai
        </h2>
      </Link>

      {/* Desktop Navigation */}
      <div className="flex items-center gap-4 md:px-8 py-2">
        <ul className="hidden md:block justify-end font-medium text-lg">
          <li className={`right-0 `}>
            {authUser ? (
              <button
                onClick={() => logout()}
                className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded shadow"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth">
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                  Login
                </button>
              </Link>
            )}
          </li>
        </ul>

        <Link href="/cart">
          <FaShoppingCart className="text-white cursor-pointer" size={35} />
        </Link>
        {authUser ? (
          <p className="relative -top-5 -left-5 bg-blue-500 rounded-full p-1 ">
            {cartCount}
          </p>
        ) : (
          ""
        )}
        {/* </Link> */}

        {/* Mobile Navigation Toggle */}
        <span className="md:hidden cursor-pointer " onClick={toggleNavbar}>
          {isNavbarOpen ? (
            <AiOutlineClose size="2em" color="white" />
          ) : (
            <AiOutlineMenu size="1.5em" color="white" />
          )}
        </span>
      </div>

      {isNavbarOpen && <MobileNavigation />}
    </header>
  );
};

export default Navbar;
