// app/page.tsx
import HomeClient from "./components/HomeClient";
import { Product } from "@/types"; //

// Fungsi fetch ke API Route
async function getProducts(): Promise<Product[]> {
  // Ganti URL ini dengan domain production Anda nanti jika sudah deploy
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // 'no-store' artinya data tidak dicache (selalu fresh), cocok untuk e-commerce
  // Jika ingin cache, ganti menjadi { next: { revalidate: 3600 } } (1 jam)
  const res = await fetch(`${apiUrl}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch products");
    return [];
  }

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return <HomeClient initialProducts={products} />;
}
