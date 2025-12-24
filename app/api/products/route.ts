// app/api/products/route.ts

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/supabase";

export const runtime = "edge"; // Sangat disarankan untuk Cloudflare Pages/Workers

export async function GET() {
  try {
    // Memanggil helper yang sudah spesifik memilih kolom
    const products = await getProducts();

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "Data produk kosong" },
        { status: 200 },
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data produk dari Supabase:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 },
    );
  }
}
