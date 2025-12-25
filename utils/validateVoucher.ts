// utils/validateVoucher.ts
import type { Voucher } from "@/types";
import { isVoucherActive } from "@/utils/isVoucherActive";

interface ValidationResult {
  isValid: boolean;
  message: string;
  discountAmount: number;
  voucher?: Voucher;
}

export const validateVoucher = (
  code: string,
  subtotal: number,
  availableVouchers: Voucher[],
): ValidationResult => {
  const voucher = availableVouchers.find(
    (v) => v.kode.toUpperCase() === code.toUpperCase(),
  );

  if (!voucher) {
    return {
      isValid: false,
      message: "Voucher code not found.",
      discountAmount: 0,
    };
  }

  if (!isVoucherActive(voucher)) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // pengecekan null-safety sebelum .toString()
    if (voucher.mulai) {
      const startStr = voucher.mulai.toString().split("T")[0];
      const startDate = new Date(`${startStr}T00:00:00`);

      if (now.getTime() < startDate.getTime()) {
        return {
          isValid: false,
          message: "Voucher is not active yet.",
          discountAmount: 0,
        };
      }
    }

    return {
      isValid: false,
      message: "Voucher has expired.",
      discountAmount: 0,
    };
  }

  // Gunakan fallback ?? 0 agar tidak error saat dibandingkan dengan subtotal
  const minPurchase = voucher.min_belanja ?? 0;
  if (subtotal < minPurchase) {
    return {
      isValid: false,
      message: `Minimum purchase Rp ${minPurchase.toLocaleString()} required.`,
      discountAmount: 0,
    };
  }

  // Null-safety untuk diskon_persen
  const discountPercent = voucher.diskon_persen ?? 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  return {
    isValid: true,
    message: `Voucher applied: ${discountPercent}% discount!`,
    discountAmount,
    voucher,
  };
};
