// components/CheckoutForm.tsx
import React, { useState, useEffect } from "react";
import { MessageCircle, X, Tag } from "lucide-react";
import type { CartItem, CustomerData, Voucher } from "@/types";
import { formatRupiah } from "@/utils/format";
// Import helper/data voucher sesuai path anda

interface CheckoutFormProps {
  cartItems: CartItem[];
  subtotal: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, subtotal }) => {
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = subtotal - discountAmount;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    const itemList = cartItems
      .map((item, index) => {
        const price =
          item.harga_normal - (item.harga_normal * item.diskon_persen) / 100;
        return `${index + 1}. ${item.nama} - ${item.quantity}x (${formatRupiah(price * item.quantity)})`;
      })
      .join("\n");

    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE;
    const message = `Halo Admin, saya ingin order:\n\n${itemList}\n\n*Total Tagihan: ${formatRupiah(finalTotal)}*\n\n*Data Pemesan:*\nNama: ${formData.name}\nAlamat: ${formData.address}`;

    window.open(
      `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="bg-neutral-50 border border-gray-200 p-6 sticky top-24">
      <h3 className="text-2xl text-street-gray font-black uppercase italic mb-6 border-b-2 border-black pb-2">
        Checkout
      </h3>
      <form onSubmit={handleCheckout} className="space-y-4">
        {/* Full Name Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs font-black uppercase text-gray-700 ml-1"
          >
            Full Name <span className="text-street-red">*</span>
          </label>
          <input
            id="name"
            name="name"
            placeholder="e.g. John Doe"
            required
            onChange={handleChange}
            className="w-full border-2 border-gray-300 p-3 text-sm text-gray-700 focus:border-black focus:outline-none transition-colors"
          />
        </div>

        {/* WhatsApp Number Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phone"
            className="text-xs font-black uppercase text-gray-700 ml-1"
          >
            WhatsApp Number <span className="text-street-red">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0812xxxxxxx"
            required
            onChange={handleChange}
            className="w-full border-2 border-gray-300 p-3 text-sm text-gray-700 focus:border-black focus:outline-none transition-colors"
          />
        </div>

        {/* Address Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="address"
            className="text-xs font-black uppercase text-gray-700 ml-1"
          >
            Shipping Address <span className="text-street-red">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Street name, House number, City..."
            required
            onChange={handleChange}
            className="w-full border-2 border-gray-300 p-3 text-sm text-gray-700 focus:border-black focus:outline-none transition-colors"
            rows={3}
          />
        </div>

        {/* Summary & Button */}
        <div className="pt-4 border-t-2 border-black border-dashed space-y-2 mt-6">
          <div className="flex justify-between font-bold text-gray-500 uppercase text-xs">
            <span>Subtotal ({totalItems} items)</span>
            <span className="text-black">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-street-gray font-black uppercase text-xl border-t-2 border-black pt-2">
            <span>Total</span>
            <span className="text-street-red">{formatRupiah(finalTotal)}</span>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 mt-4 font-black uppercase hover:bg-street-red transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            Order via WhatsApp <MessageCircle size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
