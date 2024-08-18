"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <div className="px-6 mt-4">
        <main className="flex flex-wrap justify-center sm:justify-between gap-4">
          {products?.map((product) => (
            <ProductCard key={product.id} data = {product} />
          ))}
        </main>
      </div>
    </>
  );
}
