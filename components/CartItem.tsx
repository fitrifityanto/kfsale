// components/CartItem.tsx
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types";
import { formatRupiah } from "@/utils/format";

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQty, onRemove }) => {
  const PAYLOAD_URL =
    process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";
  const discount = item.diskon_persen ?? 0;
  const discountAmount = (item.harga_normal * discount) / 100;
  const finalPrice = item.harga_normal - discountAmount;

  const getImageUrl = () => {
    if (
      item.gambar_media &&
      typeof item.gambar_media === "object" &&
      item.gambar_media.url
    ) {
      return `${PAYLOAD_URL}${item.gambar_media.url}`;
    }
    return item.gambar || "/placeholder-image.png"; // Pastikan string, bukan null
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 py-6 last:border-b-0">
      {/* Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 overflow-hidden border border-gray-200">
        <img
          src={getImageUrl()}
          alt={item.nama}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <h4 className="font-black text-lg uppercase tracking-tight text-black">
            {item.nama}
          </h4>
          <p className="text-xs text-gray-500 font-mono mt-1">
            ID: {item.id?.substring(0, 8)}...
          </p>
          <div className="mt-2 text-street-red font-bold">
            {formatRupiah(finalPrice)}{" "}
            <span className="text-gray-500 text-xs line-through font-normal ml-2">
              {formatRupiah(item.harga_normal)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 mt-4 sm:mt-0">
        <div className="flex items-center border-2 border-black">
          <button
            onClick={() => item.id && onUpdateQty(item.id, -1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-black hover:text-white hover:bg-black transition-colors disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-street-gray font-bold text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => item.id && onUpdateQty(item.id, 1)}
            className="w-8 h-8 flex items-center justify-center text-black hover:text-white hover:bg-black transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => item.id && onRemove(item.id)}
          className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-street-red flex items-center gap-1 transition-colors"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
