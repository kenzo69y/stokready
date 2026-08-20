NOVA MART V3 — FOTO PRODUK + SUPABASE

Produk, harga dan stok tetap mengambil data dari Supabase Kasir Toko.

CARA MENAMBAHKAN FOTO:
1. Buka folder images.
2. Lihat kode produk di Kasir Toko/Supabase.
3. Nama file foto HARUS sama dengan kode produk.

CONTOH:
Kode produk: RK001
Foto:
images/RK001.jpg

Kode produk: MI001
Foto:
images/MI001.jpg

Format yang didukung:
.jpg
.png
.webp

Sistem mencoba JPG -> PNG -> WEBP.
Jika foto tidak ditemukan, ikon/emoji lama tetap tampil otomatis.

Jadi kamu TIDAK perlu mengubah script.js setiap mengganti foto.
Cukup hapus foto lama dan masukkan foto baru dengan nama kode produk yang sama.

SUPABASE:
Produk: products.name
Kode: products.code
Harga jual: products.sell_price
Stok: products.stock

TELEGRAM:
Buka script.js lalu ganti:
const TELEGRAM_USERNAME="GANTI_USERNAME_TELEGRAM";
dengan username Telegram toko tanpa @.

CATATAN:
Stok V3 hanya dibaca dari Kasir Toko.
Order Telegram belum otomatis mengurangi stok.
