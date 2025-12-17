import type { Voucher } from "../types";
import { isVoucherActive } from "./isVoucherActive";

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

    // Parse start date sebagai waktu lokal
    const startDate = new Date(`${voucher.mulai}T00:00:00`);
    // const endDate = new Date(voucher.berakhir + "T23:59:59Z");

    // Cek apakah tanggal hari ini (00:00) lebih kecil dari tanggal mulai (00:00)
    if (now.getTime() < startDate.getTime()) {
      return {
        isValid: false,
        message: "Voucher is not active yet.",
        discountAmount: 0,
      };
    }

    // Jika logic sampai sini, berarti sudah melewati startDate, maka pasti expired
    return {
      isValid: false,
      message: "Voucher has expired.",
      discountAmount: 0,
    };
  }

  if (subtotal < voucher.min_belanja) {
    return {
      isValid: false,
      message: `Minimum purchase Rp ${voucher.min_belanja.toLocaleString()} required.`,
      discountAmount: 0,
    };
  }

  const discount = (subtotal * voucher.diskon_persen) / 100;

  return {
    isValid: true,
    message: `Voucher applied! -${voucher.diskon_persen}%`,
    discountAmount: discount,
    voucher: voucher,
  };
};
