import type { Voucher } from "../types";

/**
 * Memeriksa apakah suatu voucher sedang aktif berdasarkan tanggal hari ini (Waktu Lokal).
 */
export const isVoucherActive = (voucher: Voucher): boolean => {
  // 1. Ambil waktu saat ini
  const now = new Date();

  // 2. Reset jam ke 00:00:00 waktu LOKAL

  now.setHours(0, 0, 0, 0);
  const todayTimestamp = now.getTime();

  // 3. Parse tanggal mulai & akhir sebagai waktu LOKAL

  const startDate = new Date(`${voucher.mulai}T00:00:00`);
  const endDate = new Date(`${voucher.berakhir}T23:59:59`);

  return (
    todayTimestamp >= startDate.getTime() && todayTimestamp <= endDate.getTime()
  );
};
