// app/page.tsx
import HomeClient from "@/components/HomeClient";
import { connectDb, ProductModel, VoucherModel } from "@/lib/db"; // Import langsung dari db.ts

async function getProducts() {
  await connectDb();
  // Menggunakan .lean() agar data lebih ringan dan mudah di-serialize
  const products = await ProductModel.find({}).lean();
  // Konversi _id MongoDB ke string agar tidak error saat dikirim ke Client Component
  return JSON.parse(JSON.stringify(products));
}

async function getVouchers() {
  await connectDb();
  const vouchers = await VoucherModel.find({}).lean();
  return JSON.parse(JSON.stringify(vouchers));
}

export default async function Home() {
  // Panggil data langsung tanpa melalui fetch HTTP
  const [products, vouchers] = await Promise.all([
    getProducts(),
    getVouchers(),
  ]);

  return <HomeClient initialProducts={products} vouchers={vouchers} />;
}
