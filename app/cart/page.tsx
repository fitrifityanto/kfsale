"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { cartCount } = useCart();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={cartCount}
        onCartClick={() => {}}
        onHomeClick={() => router.push("/")}
      />

      <main className="flex-grow">
        <Cart onBackToHome={() => router.push("/")} />
      </main>

      <Footer />
    </div>
  );
}
