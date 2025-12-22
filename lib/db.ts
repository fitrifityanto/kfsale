import mongoose, { Schema, Model } from "mongoose";
import { Product, Voucher } from "@/types"; // Sesuaikan path import types Anda

// Konfigurasi koneksi untuk mencegah koneksi ganda di development (Next.js Hot Reload)
const connection: { isConnected?: number } = {};

async function connectDb() {
  if (connection.isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Pastikan MONGO_URI sudah didefinisikan di .env");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Gagal terhubung ke database");
  }
}

// =========================================================
// SCHEMA DEFINITIONS (Berdasarkan file product.ts & voucher.ts)
// =========================================================

// 1. Product Schema
// Data source: id, nama, gambar, harga_normal, diskon_persen, deskripsi
const productSchema = new Schema<Product>(
  {
    nama: { type: String, required: true },
    gambar: { type: String, required: true },
    harga_normal: { type: Number, required: true },
    diskon_persen: { type: Number, required: true },
    deskripsi: { type: String, required: true },
  },
  {
    timestamps: true, // Otomatis menambah createdAt dan updatedAt
    collection: "products", // Nama collection di MongoDB Atlas
  },
);

// 2. Voucher Schema
// Data source: kode, diskon_persen, min_belanja, mulai, berakhir
const voucherSchema = new Schema<Voucher>(
  {
    kode: { type: String, required: true, unique: true, uppercase: true },
    diskon_persen: { type: Number, required: true },
    min_belanja: { type: Number, required: true },
    // Penting: Kita ubah String tanggal menjadi tipe Date agar mudah difilter (misal: cari voucher yang aktif hari ini)
    mulai: { type: Date, required: true },
    berakhir: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "vouchers",
  },
);

// =========================================================
// MODELS
// =========================================================

// "mongoose.models.Product || ..." digunakan untuk mencegah error "OverwriteModelError"
// saat Next.js melakukan hot reload di mode development.

const ProductModel =
  (mongoose.models.Product as Model<Product>) ||
  mongoose.model<Product>("Product", productSchema);
const VoucherModel =
  (mongoose.models.Voucher as Model<Voucher>) ||
  mongoose.model<Voucher>("Voucher", voucherSchema);

export { connectDb, ProductModel, VoucherModel };
