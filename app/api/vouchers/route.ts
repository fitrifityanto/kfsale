// app/api/vouchers/route.ts
import { NextResponse } from "next/server";
import { connectDb, VoucherModel } from "@/lib/db";
import { Voucher } from "@/types";

// Interface bantu untuk merepresentasikan data mentah dari MongoDB
interface VoucherDocument extends Omit<Voucher, "_id"> {
  _id: { toString(): string };
  mulai: Date;
  berakhir: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    await connectDb();

    // Ambil semua data voucher dari MongoDB
    const vouchers = await VoucherModel.find({}).lean<VoucherDocument[]>();

    // Serialisasi data: Mengubah ObjectID dan Date menjadi String
    // agar bisa dikirim melalui network sebagai JSON.
    const serializedVouchers = vouchers.map((v) => ({
      ...v,
      _id: v._id.toString(),
      // Tetap kirim sebagai ISO String, nanti di VoucherBanner
      // akan diubah kembali menjadi objek Date menggunakan new Date()
      mulai: v.mulai.toISOString(),
      berakhir: v.berakhir.toISOString(),
      createdAt: v.createdAt ? v.createdAt.toISOString() : undefined,
      updatedAt: v.updatedAt ? v.updatedAt.toISOString() : undefined,
    }));

    return NextResponse.json(serializedVouchers, { status: 200 });
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data voucher" },
      { status: 500 },
    );
  }
}
