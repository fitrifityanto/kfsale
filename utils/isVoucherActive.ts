// utils/isVoucherActive.ts
import type { Voucher } from "@/types";

export const isVoucherActive = (voucher: Voucher): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayTimestamp = now.getTime();

  // Ambil YYYY-MM-DD saja dari string ISO agar tidak bentrok dengan T00:00:00
  const startStr = voucher.mulai.toString().split("T")[0];
  const endStr = voucher.berakhir.toString().split("T")[0];

  const startDate = new Date(`${startStr}T00:00:00`);
  const endDate = new Date(`${endStr}T23:59:59`);

  return (
    todayTimestamp >= startDate.getTime() && todayTimestamp <= endDate.getTime()
  );
};
