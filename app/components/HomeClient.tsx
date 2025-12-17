"use client";

import React, { useState } from "react";
import Header from "./Header";
import ProductGrid from "./ProductGrid";
import { Product } from "@/types";

interface HomeClientProps {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
  // State untuk keranjang belanja
  const [cart, setCart] = useState<Product[]>([]);

  // Handler saat tombol Add to Cart diklik
  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    alert(`${product.nama} added to cart!`); // Feedback sederhana
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Header menerima jumlah cart dan interaksi */}
      <Header
        cartCount={cart.length}
        onCartClick={() => console.log("Open Cart")}
        onHomeClick={() => window.location.reload()}
      />

      {/* 2. Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
            New Arrivals
          </h2>
          <div className="w-20 h-1 bg-street-red"></div>
        </div>

        {/* 3. ProductGrid menerima data produk dan fungsi add to cart */}
        <ProductGrid
          products={initialProducts}
          onAddToCart={handleAddToCart}
          isLoading={false}
        />
      </main>

      {/* Optional: Footer sederhana */}
      <footer className="bg-street-black text-white py-8 text-center uppercase tracking-widest text-xs">
        © 2025 Kickflip Socks
      </footer>
    </div>
  );
}
