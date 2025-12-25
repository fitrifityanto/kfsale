// src/types/index.ts
import {
  Product as PayloadProduct,
  Voucher as PayloadVoucher,
} from "./payload-types";

// Export ulang agar komponen lain tidak error
export type Product = PayloadProduct;
export type Voucher = PayloadVoucher;

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  note?: string;
}
