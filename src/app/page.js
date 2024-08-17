import ProductCard from "@/components/ProductCard";

ProductCard;

export default function Home() {
  // products url - https://fakestoreapi.com/products
  return (
    <main className="flex flex-row gap-16 p-12">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </main>
  );
}
