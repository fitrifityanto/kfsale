// app/api/test-db/route.ts

import { supabase } from "@/lib/supabase"; // Pastikan path ini sesuai dengan lokasi file supabase.ts Anda
import { NextResponse } from "next/server";

/**
 * Endpoint GET untuk menguji koneksi ke Supabase.
 * @returns Status koneksi dan jumlah data yang ditemukan
 */
export async function GET() {
  try {
    // Kita mencoba mengambil satu data dari tabel products untuk mengetes koneksi
    //
    const { data, error, count } = await supabase
      .from("products")
      .select("nama", { count: "exact", head: false });

    if (error) {
      throw error;
    }

    // Jika berhasil, kirim respons sukses beserta jumlah produk yang ada di database
    return NextResponse.json(
      {
        success: true,
        message: "Koneksi ke Supabase Berhasil!",
        total_products: data.length,
        sample_data: data[0] || "Tidak ada data produk",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Supabase Connection Test Failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json(
      {
        success: false,
        message: `Koneksi Gagal: ${errorMessage}. Pastikan RLS sudah di-set dan Env Variable benar.`,
      },
      { status: 500 },
    );
  }
}
