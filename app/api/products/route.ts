// app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDb, ProductModel } from "@/lib/db";
import { Product } from "@/types";

// Buat interface bantu untuk representasi data mentah dari MongoDB
interface ProductDocument extends Omit<Product, "_id"> {
  _id: { toString(): string };
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    await connectDb();

    // Ambil data dari MongoDB
    const products = await ProductModel.find({}).lean<ProductDocument[]>();

    // Serialisasi data (sama seperti logic sebelumnya)
    const serializedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      // Mapping tambahan jika Anda masih butuh properti 'id' tanpa underscore
      id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : undefined,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : undefined,
    }));

    // Return response JSON
    return NextResponse.json(serializedProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 },
    );
  }
}
