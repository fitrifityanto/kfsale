// components/CheckoutForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Tag } from "lucide-react";
import type { CartItem, CustomerData, Voucher } from "@/types";
import { formatRupiah } from "@/utils/format";
import { validateVoucher } from "@/utils/validateVoucher";
import VoucherListModal from "@/components/VoucherListModal";
import { getVouchers } from "@/lib/api";

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

  // State untuk menyimpan daftar voucher dari API
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch data voucher dari API Route saat komponen mount
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getVouchers();
        setVouchers(data);
      } catch (error) {
        console.error("Failed to load vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  // 2. Reset atau hitung ulang voucher jika subtotal berubah
  useEffect(() => {
    if (appliedVoucher) {
      const result = validateVoucher(
        appliedVoucher.kode,
        subtotal,
        vouchers, // Menggunakan state vouchers
      );
      if (!result.isValid) {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        setVoucherMessage({ type: "error", text: result.message });
      } else {
        setDiscountAmount(result.discountAmount);
      }
    }
  }, [subtotal, appliedVoucher, vouchers]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = subtotal - discountAmount;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyVoucher = (e?: React.MouseEvent | string) => {
    if (typeof e !== "string") e?.preventDefault();

    setVoucherMessage(null);
    const codeToValidate = typeof e === "string" ? e : voucherCode;

    if (!codeToValidate.trim()) return;

    const result = validateVoucher(codeToValidate, subtotal, vouchers);

    if (result.isValid && result.voucher) {
      setAppliedVoucher(result.voucher);
      setDiscountAmount(result.discountAmount);
      setVoucherMessage({ type: "success", text: result.message });
      setVoucherCode(result.voucher.kode);
    } else {
      setAppliedVoucher(null);
      setDiscountAmount(0);
      setVoucherMessage({ type: "error", text: result.message });
    }
  };

  // 3. Fungsi handleSelectVoucher untuk menangani pilihan dari Modal
  const handleSelectVoucher = (code: string) => {
    setVoucherCode(code);
    handleApplyVoucher(code); // Langsung apply setelah dipilih
    setIsModalOpen(false);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherCode("");
    setVoucherMessage(null);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    const itemList = cartItems
      .map((item, index) => {
        const diskon = item.diskon_persen ?? 0;
        const price = item.harga_normal - (item.harga_normal * diskon) / 100;
        return `${index + 1}. ${item.nama} - ${item.quantity}x (${formatRupiah(price * item.quantity)})`;
      })
      .join("\n");

    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE;

    // Logic untuk menambahkan info voucher ke pesan
    let voucherInfo = "";
    if (appliedVoucher) {
      voucherInfo = `\nSubtotal: ${formatRupiah(subtotal)}\nVoucher: ${appliedVoucher.kode} (-${formatRupiah(discountAmount)})`;
    }

    const message = `Halo Admin, saya ingin order:\n\n${itemList}\n${voucherInfo}\n\n*Total Tagihan: ${formatRupiah(finalTotal)}*\n\n*Data Pemesan:*\nNama: ${formData.name}\nWhatsApp: ${formData.phone}\nAlamat: ${formData.address}${formData.note ? `\nCatatan: ${formData.note}` : ""}`;

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
        {/* Input fields tetap sama (Name, Phone, Address) */}
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
            required
            onChange={handleChange}
            className="w-full border-2 border-gray-300 text-street-gray p-3 text-sm focus:border-black focus:outline-none"
          />
        </div>

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
            required
            onChange={handleChange}
            className="w-full border-2 border-gray-300 text-street-gray p-3 text-sm focus:border-black focus:outline-none"
          />
        </div>

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
            required
            onChange={handleChange}
            className="w-full border-2 border-gray-300 text-street-gray p-3 text-sm focus:border-black focus:outline-none"
            rows={3}
          />
        </div>

        {/* Voucher Section */}
        <div className="pt-4 border-t border-gray-200 mt-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Voucher Code
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] font-bold uppercase text-black hover:text-street-red underline transition-colors"
            >
              View All Vouchers
            </button>
          </div>

          {!appliedVoucher ? (
            <div className="flex lg:flex-col gap-2 flex-row ">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="CODE"
                className="flex-grow bg-white border-2 text-street-gray border-gray-200 p-3 text-sm font-bold uppercase focus:border-black focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplyVoucher()}
                className="bg-gray-200 text-black px-4 lg:py-3 font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors border-2 border-transparent"
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-green-700">
                <Tag size={14} />
                <span className="text-xs font-bold uppercase">
                  {appliedVoucher.kode} Applied
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {voucherMessage && !appliedVoucher && (
            <p
              className={`text-[10px] font-bold uppercase tracking-wide mt-2 ${voucherMessage.type === "error" ? "text-street-red" : "text-green-600"}`}
            >
              {voucherMessage.text}
            </p>
          )}
        </div>

        {/* Summary & Button */}
        <div className="pt-4 border-t-2 border-black border-dashed space-y-2 mt-6">
          <div className="flex justify-between font-bold text-gray-500 uppercase text-xs">
            <span>Subtotal ({totalItems} items)</span>
            <span className="text-black">{formatRupiah(subtotal)}</span>
          </div>

          {appliedVoucher && (
            <div className="flex justify-between items-center text-street-red">
              <span className="text-sm font-bold uppercase">
                Discount ({appliedVoucher.diskon_persen}%)
              </span>
              <span className="text-base font-bold">
                -{formatRupiah(discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-street-gray font-black uppercase text-xl border-t-2 border-black pt-2">
            <span>Total</span>
            <span className="text-street-red">{formatRupiah(finalTotal)}</span>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 mt-4 font-black uppercase hover:bg-street-red transition-all flex items-center justify-center gap-2"
          >
            Order via WhatsApp <MessageCircle size={18} />
          </button>
        </div>
      </form>

      <VoucherListModal
        vouchers={vouchers}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectVoucher={handleSelectVoucher}
      />
    </div>
  );
};

export default CheckoutForm;
