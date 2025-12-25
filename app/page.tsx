// app/page.tsx

import HomeClient from "@/components/HomeClient";
import { getProducts, getVouchers } from "@/lib/api";

export default async function Home() {
  try {
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
