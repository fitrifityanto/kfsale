// app/api/seed/route.ts

import { connectDb, ProductModel, VoucherModel } from "@/lib/db";
import { NextResponse } from "next/server";

// ==========================================================
// 1. DATA PRODUK (DIAMBIL DARI product.ts)
// ==========================================================
// Pastikan tidak ada "import" di sini agar bisa dieksekusi langsung
const productsData = [
  {
    nama: "kk local made in local putih",
    gambar: "/images/products/kk-local-made-in-local-putih.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki lokal berkualitas warna putih.",
  },
  {
    nama: "kk local pride strip biru merah biru putih",
    gambar: "/images/products/kk-local-pride-strip-biru-merah-biru-putih.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi:
      "Kaos Kaki local pride dengan strip warna biru, merah, biru, dan putih.",
  },
  {
    nama: "kk local strip biru merah biru putih",
    gambar: "/images/products/kk-local-strip-biru-merah-biru-putih.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi:
      "Kaos Kaki lokal dengan strip warna biru, merah, biru, dan putih.",
  },
  {
    nama: "kk motif 70'S",
    gambar: "/images/products/kk-motif-70-s.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif 70'S warna putih yang keren.",
  },
  {
    nama: "kk motif arrow-blue hitam",
    gambar: "/images/products/kk-motif-arrow-blue-hitam.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif arrow-blue dengan warna dasar hitam.",
  },
  {
    nama: "kk motif offside-red hitam",
    gambar: "/images/products/kk-motif-offside-red-hitam.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif offside-red dengan warna dasar hitam.",
  },
  {
    nama: "kk motif offside-yellow hitam",
    gambar: "/images/products/kk-motif-offside-yellow-hitam.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif offside-yellow dengan warna dasar hitam.",
  },
  {
    nama: "kk motif off the wall hitam",
    gambar: "/images/products/kk-motif-off-the-wall-hitam.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif 'off the wall' dengan warna dasar hitam.",
  },
  {
    nama: "kk motif off the wall putih",
    gambar: "/images/products/kk-motif-off-the-wall-putih.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif 'off the wall' dengan warna dasar putih.",
  },
  {
    nama: "kk motif arrow-red hitam",
    gambar: "/images/products/kk-motif-arrow-red-hitam.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif arrow-red dengan warna dasar hitam.",
  },
  {
    nama: "kk motif DON'T QUIT hitam",
    gambar: "/images/products/kk-motif-don-t-quit-hitam.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki motif DON'T QUIT dengan warna dasar hitam.",
  },
  {
    nama: "kk motif coffee",
    gambar: "/images/products/kk-motif-coffee.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki dengan motif coffee.",
  },
  {
    nama: "kk motif notes",
    gambar: "/images/products/kk-motif-notes.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki dengan motif notes.",
  },
  {
    nama: "kk motif chicken",
    gambar: "/images/products/kk-motif-chicken.webp",
    harga_normal: 10000,
    diskon_persen: 35,
    deskripsi: "Kaos Kaki dengan chicken.",
  },
];

// ==========================================================
// 2. DATA VOUCHER (DIAMBIL DARI voucher.ts + Konversi Date)
// PENTING: Mengubah string tanggal menjadi objek new Date()
// ==========================================================
const vouchersData = [
  {
    kode: "EASY20",
    diskon_persen: 20,
    min_belanja: 50000,
    mulai: new Date("2025-12-01"),
    berakhir: new Date("2025-12-24"),
  },
  {
    kode: "WKND35",
    diskon_persen: 35,
    min_belanja: 75000,
    mulai: new Date("2025-12-19"),
    berakhir: new Date("2025-12-21"),
  },
  {
    kode: "LAST45",
    diskon_persen: 45,
    min_belanja: 130000,
    mulai: new Date("2025-12-25"),
    berakhir: new Date("2025-12-31"),
  },
  {
    kode: "KF0101",
    diskon_persen: 45,
    min_belanja: 100000,
    mulai: new Date("2026-01-01"),
    berakhir: new Date("2026-01-02"),
  },
];

// API Route untuk menjalankan seeding (hanya menerima method GET)
export async function GET() {
  try {
    // 1. Koneksi DB
    await connectDb();

    // 2. Hapus data lama (opsional: agar tidak duplikat saat dijalankan berkali-kali)
    // Ini penting jika Anda sering mengubah data manual dan ingin fresh start
    await ProductModel.deleteMany({});
    await VoucherModel.deleteMany({});
    console.log("Old data destroyed!");

    // 3. Masukkan data baru menggunakan insertMany
    await ProductModel.insertMany(productsData);
    await VoucherModel.insertMany(vouchersData);
    console.log("New data imported successfully!");

    return NextResponse.json(
      {
        success: true,
        message:
          "Database berhasil di-seed (diisi) dengan data produk dan voucher!",
        imported_products: productsData.length,
        imported_vouchers: vouchersData.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Data Seeding Failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal melakukan data seeding. Cek koneksi DB atau struktur data.",
      },
      { status: 500 },
    );
  }
}
