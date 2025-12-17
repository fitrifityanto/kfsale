// app/api/test-db/route.ts

import { connectDb } from "@/lib/db"; // Ganti '@/lib/db' jika Anda menggunakan path relatif
import { NextResponse } from "next/server";

/**
 * Endpoint GET untuk menguji koneksi ke MongoDB Atlas.
 * @returns Status koneksi
 */
export async function GET() {
  try {
    // Panggil fungsi koneksi yang sudah kita buat
    await connectDb();

    // Jika tidak ada error, berarti koneksi berhasil
    return NextResponse.json(
      {
        success: true,
        message: "Koneksi ke MongoDB Atlas Berhasil!",
      },
      { status: 200 },
    );
  } catch (error) {
    // Jika ada error, koneksi gagal.
    console.error("Connection Test Failed:", error);

    // Cek error yang lebih spesifik
    const errorMessage =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json(
      {
        success: false,
        message: `Koneksi Gagal: ${errorMessage}. Cek MONGO_URI dan Network Access di Atlas Anda.`,
      },
      { status: 500 },
    );
  }
}
