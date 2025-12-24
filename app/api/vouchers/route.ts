// app/api/vouchers/route.ts
import { NextResponse } from "next/server";
import { getVouchers } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  try {
    // Memanggil helper voucher dari supabase.ts
    const vouchers = await getVouchers();

    return NextResponse.json(vouchers, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data voucher dari Supabase:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data voucher" },
      { status: 500 },
    );
  }
}
