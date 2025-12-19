// HomeClient.tsx
"use client";

import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import ProductGrid from "./ProductGrid";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface HomeClientProps {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const { addToCart, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
            New Arrivals
          </h2>
          <div className="w-20 h-1 bg-street-red"></div>
        </div>

        <ProductGrid
          products={initialProducts}
          onAddToCart={addToCart} // Fungsi ini sekarang akan mengupdate Header secara otomatis
          isLoading={false}
        />
      </main>

      <Footer />
    </div>
  );
}
