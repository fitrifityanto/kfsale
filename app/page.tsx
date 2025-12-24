// app/page.tsx

import HomeClient from "@/components/HomeClient";
import { getProducts, getVouchers } from "@/lib/supabase";

// Mengaktifkan Edge Runtime agar loading halaman sangat cepat di Cloudflare
export const runtime = "edge";

export default async function Home() {
  try {
    // Memanggil data secara paralel dari Supabase

    const [products, vouchers] = await Promise.all([
      getProducts(),
      getVouchers(),
    ]);

    return <HomeClient initialProducts={products} vouchers={vouchers} />;
  } catch (error) {
    console.error("Gagal memuat halaman utama:", error);
    // Fallback jika database bermasalah agar website tidak blank putih
    return <HomeClient initialProducts={[]} vouchers={[]} />;
  }
}
