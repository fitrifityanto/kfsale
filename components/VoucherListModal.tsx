import React, { useState } from "react";
import { X, Tag, Copy, Check } from "lucide-react";
import type { Voucher } from "@/types";
import { formatRupiah } from "@/utils/format";
import { isVoucherActive } from "@/utils/isVoucherActive";

interface VoucherListModalProps {
  vouchers: Voucher[];
  isOpen: boolean;
  onClose: () => void;
  onSelectVoucher: (code: string) => void;
}

const VoucherListModal: React.FC<VoucherListModalProps> = ({
  vouchers,
  isOpen,
  onClose,
  onSelectVoucher,
}) => {
  if (!isOpen) return null;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeVouchers = vouchers.filter((v) => isVoucherActive(v));

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onSelectVoucher(code);

    // Hapus pesan "Disalin!" setelah 2 detik
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-black text-street-gray uppercase tracking-tighter italic">
            Active Vouchers
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {activeVouchers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            There are currently no active vouchers.
          </p>
        ) : (
          <div className="space-y-4">
            {activeVouchers.map((voucher) => {
              const isCopied = copiedCode === voucher.kode;
              return (
                <div
                  key={voucher.kode}
                  className="p-4 border-2 border-dashed text-gray-700 border-gray-300 rounded-lg shadow-sm bg-neutral-50"
                >
                  <div className="flex justify-between items-start mb-2 relative">
                    <div className="flex items-center gap-2">
                      <Tag size={18} className="text-street-red" />
                      <span className="text-sm font-bold uppercase text-street-red">
                        {voucher.diskon_persen}% OFF
                      </span>
                    </div>

                    {/* Copy Button*/}
                    <button
                      onClick={() => handleCopy(voucher.kode)}
                      className="flex items-center gap-1 text-xs font-bold uppercase transition-colors"
                    >
                      {isCopied ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check size={14} />
                          <span>Copied!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-black hover:text-street-red">
                          <Copy size={14} />
                          <span>Copy</span>
                        </div>
                      )}
                    </button>
                  </div>

                  <h4 className="text-xl font-black tracking-widest uppercase mb-2">
                    {voucher.kode}
                  </h4>

                  <p className="text-xs text-gray-600">
                    Minimum purchase: {formatRupiah(voucher.min_belanja)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Valid until:{" "}
                    {new Date(voucher.berakhir).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherListModal;
