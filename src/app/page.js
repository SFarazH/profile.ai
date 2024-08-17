"use client";
import { useEffect } from "react";
import ProductCard from "@/components/ProductCard";

export default function Home() {


  return (
    <main className="flex flex-row gap-16 p-12">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </main>
  );
}
