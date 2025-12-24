// components/Cart.tsx
"use client";

import React from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import CartItem from "./CartItem";
import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/context/CartContext";

interface CartProps {
  onBackToHome: () => void;
}

const Cart: React.FC<CartProps> = ({ onBackToHome }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((total, item) => {
    const price =
      item.harga_normal - (item.harga_normal * item.diskon_persen) / 100;
    return total + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center">
        <ShoppingBag size={64} className="text-gray-200 mb-6" />
        <h2 className="text-3xl font-black uppercase italic mb-4">
          Your Cart is Empty
        </h2>
        <button
          onClick={onBackToHome}
          className="bg-black text-white px-8 py-3 font-bold uppercase cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBackToHome}
        className="flex items-center gap-2 text-sm font-bold uppercase text-gray-500 hover:text-black mb-8 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <h2 className="text-4xl text-street-gray font-black uppercase italic mb-8">
        Your Stash{" "}
        <span className="text-street-red font-mono ml-2">
          ({cartItems.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border-t-2 border-black">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CheckoutForm cartItems={cartItems} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
