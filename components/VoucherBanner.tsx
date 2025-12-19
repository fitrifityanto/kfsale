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
        const start = new Date(v.mulai);
        const end = new Date(v.berakhir);
        end.setHours(23, 59, 59, 999);
        return now >= start && now <= end;
      });

      if (activeVouchers.length === 0) return null;

      return activeVouchers.sort(
        (a, b) => b.diskon_persen - a.diskon_persen,
      )[0];
    };

    const voucher = findBestVoucher();
    if (voucher) {
      setBestVoucher(voucher);
      setIsVisible(true);
    }
  }, [vouchers]);

  useEffect(() => {
    if (!bestVoucher) return;

    const interval = setInterval(() => {
      const now = new Date();
      const endDate = new Date(bestVoucher.berakhir);
      endDate.setHours(23, 59, 59, 999);

      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsVisible(false);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysStr = days > 0 ? `${days}D ` : "";
      setTimeLeft(
        `${daysStr}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
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
    <div className="bg-neutral-900 text-white border-b border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 relative z-10 text-center md:text-left">
        <div className="flex items-center gap-3 animate-pulse">
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

        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 border border-white/10">
          <Clock size={14} className="text-street-red" />
          <span className="font-mono text-sm font-bold tracking-widest text-yellow-500">
            {timeLeft}
          </span>
        </div>

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
