export interface Product {
  _id?: string;
  nama: string;
  gambar: string;
  harga_normal: number;
  diskon_persen: number;
  deskripsi: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Voucher {
  _id?: string;
  kode: string;
  diskon_persen: number;
  min_belanja: number;
  mulai: Date;
  berakhir: Date;
}

/**
 * CartItem mewarisi semua properti dari Product
 * dengan tambahan quantity untuk jumlah item di keranjang belanja.
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Interface untuk data pembeli yang dikirim melalui CheckoutForm
 */
export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  note?: string;
}
