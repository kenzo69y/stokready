NOVA MART V3 — SUPABASE SYNC

Website ini membaca produk langsung dari database Kasir Toko:
- Nama barang: tabel products.name
- Kode: products.code
- Harga: products.sell_price
- Stok: products.stock

PENTING — SUPABASE:
Website pelanggan tidak login, jadi Supabase harus diberi izin READ-ONLY untuk role anon pada tabel products.

Jalankan SQL berikut di Supabase SQL Editor:

grant usage on schema public to anon;
grant select on table public.products to anon;

drop policy if exists "public_can_read_products" on public.products;

create policy "public_can_read_products"
on public.products
for select
to anon
using (true);

Policy ini HANYA memberi izin membaca products.
Jangan beri anon izin insert/update/delete pada products, transactions, atau tabel lain.

TELEGRAM:
Buka script.js lalu ganti:
const TELEGRAM_USERNAME="GANTI_USERNAME_TELEGRAM";

Contoh:
const TELEGRAM_USERNAME="tokokenzo";

Cara jalankan:
1. Extract ZIP.
2. Buka folder di VS Code.
3. Jalankan index.html dengan Live Server.
4. Produk akan otomatis mengambil data dari Supabase Kasir Toko.
5. Stok diperbarui otomatis setiap 15 detik dan dicek ulang saat checkout.

CATATAN:
Checkout Telegram V3 ini belum otomatis mengurangi stok.
Stok tetap berkurang ketika transaksi benar-benar diproses melalui Kasir Toko.
