// app/page.tsx
import HomeClient from "@/components/HomeClient";
import { Product, Voucher } from "@/types";

async function getProducts(): Promise<Product[]> {
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

async function getVouchers(): Promise<Voucher[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${apiUrl}/api/vouchers`, { cache: "no-store" });
  return res.ok ? res.json() : [];
}

export default async function Home() {
  const [products, vouchers] = await Promise.all([
    getProducts(),
    getVouchers(),
  ]);

  return <HomeClient initialProducts={products} vouchers={vouchers} />;
}
