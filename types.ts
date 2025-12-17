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
