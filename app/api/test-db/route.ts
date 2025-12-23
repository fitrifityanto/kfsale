import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  const diagnostics = {
    // Mengecek apakah Environment Variable terbaca oleh Cloudflare
    env_status: {
      has_mongo_uri: !!process.env.MONGO_URI,
      // Menampilkan sedikit awalan string untuk verifikasi format (aman)
      uri_prefix: process.env.MONGO_URI
        ? process.env.MONGO_URI.substring(0, 15) + "..."
        : "MISSING",
      node_env: process.env.NODE_ENV,
    },
    database_state: "unknown",
    error_details: null as string | null,
  };

  // 1. Validasi awal sebelum mencoba koneksi
  if (!process.env.MONGO_URI) {
    return NextResponse.json(
      {
        success: false,
        message: "Error: MONGO_URI tidak terdeteksi di Dashboard Cloudflare.",
        diagnostics,
      },
      { status: 500 },
    );
  }

  try {
    // 2. Mencoba menjalankan fungsi koneksi dari db.ts Anda [cite: 11]
    await connectDb();

    // 3. Ambil status koneksi real-time dari Mongoose
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    diagnostics.database_state =
      states[mongoose.connection.readyState] || "unknown";

    return NextResponse.json({
      success: true,
      message: "Koneksi ke MongoDB Atlas Berhasil!",
      diagnostics,
    });
  } catch (err: any) {
    // 4. Tangkap error spesifik (misal: IP Whitelist atau Timeout)
    diagnostics.error_details = err.message;
    return NextResponse.json(
      {
        success: false,
        message: "Koneksi Database Gagal.",
        diagnostics,
      },
      { status: 500 },
    );
  }
}
