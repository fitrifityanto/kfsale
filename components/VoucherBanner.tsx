// components/VoucherBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Clock, Tag } from "lucide-react";
import type { Voucher } from "@/types";

interface VoucherBannerProps {
  vouchers: Voucher[];
}

const VoucherBanner: React.FC<VoucherBannerProps> = ({ vouchers }) => {
  const [bestVoucher, setBestVoucher] = useState<Voucher | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const findBestVoucher = () => {
      const now = new Date();
      const activeVouchers = vouchers.filter((v) => {
        // Validasi: Pastikan tanggal ada
        if (!v.mulai || !v.berakhir) return false;

        const start = new Date(v.mulai);
        const end = new Date(v.berakhir);

        // CATATAN: end.setHours(23, 59...) DIHAPUS agar akurat mengikuti jam di database
        return now >= start && now <= end;
      });

      if (activeVouchers.length === 0) return null;

      // Ambil voucher dengan diskon tertinggi
      return [...activeVouchers].sort(
        (a, b) => (b.diskon_persen ?? 0) - (a.diskon_persen ?? 0),
      )[0];
    };

    const voucher = findBestVoucher();
    if (voucher) {
      setBestVoucher(voucher);
      setIsVisible(true);
    }
  }, [vouchers]);

  useEffect(() => {
    if (!bestVoucher || !bestVoucher.berakhir) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      // JavaScript otomatis mengonversi format UTC Payload ke waktu lokal user
      const end = new Date(bestVoucher.berakhir!).getTime();
      const distance = end - now;

      if (distance < 0) {
        setIsVisible(false);
        clearInterval(interval);
        return;
      }

      // Kalkulasi waktu (Hari, Jam, Menit, Detik)
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      // Format string: Tampilkan hari jika > 0
      const dayDisplay = days > 0 ? `${days}d ` : "";
      const timeDisplay = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

      setTimeLeft(`${dayDisplay}${timeDisplay}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [bestVoucher]);

  const handleCopy = () => {
    if (bestVoucher) {
      navigator.clipboard.writeText(bestVoucher.kode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVisible || !bestVoucher) return null;

  return (
    <div className="bg-black text-white py-2 px-4 border-b border-white/10 relative overflow-hidden group">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="bg-street-red p-1">
            <Tag size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm uppercase tracking-wide">
            Flash Deal!{" "}
            <span className="text-street-red ml-1">
              Get {bestVoucher.diskon_persen}% OFF
            </span>
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 border border-white/10 rounded">
          <Clock size={14} className="text-street-red" />
          <span className="font-mono text-sm font-bold tracking-widest text-yellow-500">
            {timeLeft}
          </span>
        </div>

        {/* Copy Section */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase font-bold hidden md:inline">
            Use Code:
          </span>
          <div className="flex border border-white/20 hover:border-white transition-colors">
            <div className="bg-white/10 px-3 py-1 font-mono font-bold text-sm tracking-wider">
              {bestVoucher.kode}
            </div>
            <button
              onClick={handleCopy}
              className="bg-white text-black px-3 py-1 flex items-center justify-center hover:bg-street-red hover:text-white transition-colors w-10"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherBanner;
