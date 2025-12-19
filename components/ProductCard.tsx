import React from "react";
import type { Product } from "@/types";
import { formatRupiah } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Calculate price logic
  const discountAmount = (product.harga_normal * product.diskon_persen) / 100;
  const finalPrice = product.harga_normal - discountAmount;

  // SAFE GUARD: Mengambil ID dengan aman.
  // Karena di types.ts _id bersifat optional (_id?), kita beri fallback string kosong.
  const productId = product._id ? product._id.toString() : "";

  // UX IMPROVEMENT: Ambil 6 karakter terakhir dari ID MongoDB agar tidak terlalu panjang di UI
  // Contoh: "654321" dari "65a...654321"
  const displayId = productId.slice(-6).toUpperCase();

  return (
    <div className="bg-white border border-gray-200 hover:border-black transition-colors duration-300 flex flex-col h-full group relative">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.gambar}
          alt={product.nama}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" // Menambah efek zoom dikit saat hover
          loading="lazy"
        />
        {/* Discount Badge */}
        <div className="absolute top-0 left-0 bg-street-red text-white text-xs font-black px-3 py-1.5 uppercase tracking-wider">
          -{product.diskon_persen}%
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          {/* Perbaikan di sini: Menggunakan displayId hasil slice _id */}
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">
            ID: #{displayId}
          </p>
          <h3
            className="font-bold text-black text-lg uppercase tracking-tight leading-tight line-clamp-2"
            title={product.nama}
          >
            {product.nama}
          </h3>
        </div>

        {/* Price Section - Pushed down */}
        <div className="mt-auto space-y-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through font-mono mb-1">
              {formatRupiah(product.harga_normal)}
            </span>
            <span className="text-xl font-black text-street-red">
              {formatRupiah(finalPrice)}
            </span>
          </div>

          {/* Action Button */}
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
