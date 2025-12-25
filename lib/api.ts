// src/lib/api.ts
import { Product, Voucher } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=100`);
    const data = await res.json();
    return data.docs; // Payload membungkus hasil dalam 'docs'
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getVouchers = async (): Promise<Voucher[]> => {
  try {
    const res = await fetch(`${API_URL}/api/vouchers`);
    const data = await res.json();
    return data.docs;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};
