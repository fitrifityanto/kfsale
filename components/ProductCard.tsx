import React from "react";
import type { Product } from "@/types";
import { formatRupiah } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const PAYLOAD_URL =
    process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";

  const diskon = product.diskon_persen ?? 0;
  const discountAmount = (product.harga_normal * diskon) / 100;
  const finalPrice = product.harga_normal - discountAmount;

  const productId = (product.id || "").toString();
  const displayId = productId ? productId.slice(-6).toUpperCase() : "N/A";

  const getImageUrl = () => {
    if (
      product.gambar_media &&
      typeof product.gambar_media === "object" &&
      product.gambar_media.url
    ) {
      return `${PAYLOAD_URL}${product.gambar_media.url}`;
    }
    return product.gambar || "/placeholder-product.png";
  };

  return (
    <div className="bg-white border border-gray-200 hover:border-black transition-colors duration-300 flex flex-col h-full group relative">
      {/* Bagian Gambar */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-b border-gray-100">
        <img
          src={getImageUrl()}
          alt={product.nama}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {diskon > 0 && (
          <div className="absolute top-0 right-0 bg-street-red text-white px-3 py-1 font-black text-xs uppercase tracking-tighter">
            OFF {diskon}%
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">
            ID: #{displayId}
          </p>
          <h3 className="font-bold text-black text-lg uppercase tracking-tight leading-tight line-clamp-2">
            {product.nama}
          </h3>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex flex-col">
            <span className="text-xl font-black text-black">
              {formatRupiah(finalPrice)}
            </span>
            {diskon > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  {formatRupiah(product.harga_normal)}
                </span>
                <span className="text-[10px] bg-street-red text-white px-1 font-bold">
                  -{diskon}%
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-black text-white font-bold py-3 px-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-street-red transition-colors duration-200 cursor-pointer"
          >
            Add to Stash
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
