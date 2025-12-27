// src/lib/api.ts
import { Product, Voucher } from "@/types";

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/products`);
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

export const getVouchers = async (): Promise<Voucher[]> => {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/vouchers`);
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};
