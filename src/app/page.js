import ProductPage from "@/components/ProductPage";

export default function Home() {
  // products url - https://fakestoreapi.com/products
  return (
    <main className="flex flex-row gap-16 p-12">
      <ProductPage />
      <ProductPage />
    </main>
  );
}
