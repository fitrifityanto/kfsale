import React from "react";
import type { Product } from "@/types";
import { formatRupiah } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const discountAmount = (product.harga_normal * product.diskon_persen) / 100;
  const finalPrice = product.harga_normal - discountAmount;

  // PERBAIKAN: Gunakan id (Supabase) atau _id (Mongo)
  const productId = (product.id || "").toString();

  // UX: Ambil 6 karakter terakhir agar ringkas di UI
  const displayId = productId ? productId.slice(-6).toUpperCase() : "N/A";

  return (
    <div className="bg-white border border-gray-200 hover:border-black transition-colors duration-300 flex flex-col h-full group relative">
      {/* ... bagian gambar tetap sama ... */}

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
          {/* ... bagian harga tetap sama ... */}

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-black text-white font-bold py-3 px-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-street-red transition-colors duration-200 cursor-pointer"
          >
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
