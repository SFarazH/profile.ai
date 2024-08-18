"use client";
import { useEffect } from "react";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      <div className="px-6 mt-4">
        <main className="flex flex-wrap justify-center sm:justify-between gap-4">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </main>
      </div>
    </>
  );
}
