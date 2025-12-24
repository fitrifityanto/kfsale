import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

/**
 * Mengambil data produk dengan kolom spesifik
 *
 */
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("id,nama, gambar, harga_normal, diskon_persen, deskripsi") // Mengganti * dengan kolom produk
    .order("nama", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
};

/**
 * Mengambil data voucher dengan kolom spesifik
 *
 */
export const getVouchers = async () => {
  const { data, error } = await supabase
    .from("vouchers")
    .select("id, kode, diskon_persen, min_belanja, mulai, berakhir"); // Mengganti * dengan kolom voucher

  if (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
  return data;
};
