// utils/isVoucherActive.ts
import type { Voucher } from "@/types";

export const isVoucherActive = (voucher: Voucher): boolean => {
  // 1. Validasi awal: Jika tanggal tidak ada, anggap tidak aktif
  if (!voucher.mulai || !voucher.berakhir) {
    return false;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayTimestamp = now.getTime();

  // 2. Gunakan pengecekan tipe data sebelum manipulasi string
  // Payload mengembalikan ISO String, kita ambil YYYY-MM-DD agar konsisten
  const startStr = voucher.mulai.toString().split("T")[0];
  const endStr = voucher.berakhir.toString().split("T")[0];

  const startDate = new Date(`${startStr}T00:00:00`);
  const endDate = new Date(`${endStr}T23:59:59`);

  return (
    todayTimestamp >= startDate.getTime() && todayTimestamp <= endDate.getTime()
  );
};
