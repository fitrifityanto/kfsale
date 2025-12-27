import { NextResponse } from "next/server";

export async function GET() {
  const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;
  const API_KEY = process.env.PAYLOAD_API_KEY;

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/products?limit=100`, {
      headers: {
        Authorization: `users API-Key ${API_KEY}`,
      },
      // Cache selama 1 hari (86400 detik)
      next: { revalidate: 86400 },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
