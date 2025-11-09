# Changelog - Aplikasi Pengawas Sekolah

## Update Terbaru - 9 November 2025

### 🎨 Halaman Calendar (Jadwal Kegiatan)
- **FIXED:** Menghilangkan semua data dummy
- **NEW:** Integrasi dengan API `/api/events`
- **NEW:** Data real dari database local storage
- **NEW:** Dropdown sekolah dari database
- **NEW:** Fitur hapus jadwal dengan konfirmasi
- **NEW:** Empty state jika belum ada jadwal
- **NEW:** Loading state saat fetch data

## Update Sebelumnya - 9 November 2025

### ✨ Fitur Baru

1. **Halaman Login Tanpa Menu Bar**
   - Halaman login sekarang tampil full screen tanpa sidebar dan header
   - Pengalaman login yang lebih fokus dan bersih

2. **Nama Pengawas di Dashboard**
   - Dashboard sekarang menampilkan nama lengkap pengawas yang sedang login
   - Pesan sambutan personal: "Selamat datang kembali, [Nama Pengawas]!"

3. **Data Kepala Sekolah**
   - Form tambah sekolah sekarang memiliki field tambahan:
     - Nama Kepala Sekolah
     - NIP/NUPTK Kepala Sekolah
   - Informasi kepala sekolah ditampilkan di card sekolah

4. **Penyimpanan Data Sekolah**
   - Data sekolah sekarang tersimpan permanen di database lokal
   - Integrasi API untuk CRUD sekolah
   - Data tidak hilang setelah refresh atau restart

### 🔧 Perbaikan

- Database lokal sudah dikonfigurasi dengan lengkap
- Semua method storage sudah diimplementasikan
- Admin user otomatis dibuat saat pertama kali menjalankan aplikasi
- **FIXED:** Data sekolah sekarang tersimpan ke database (bukan hanya state lokal)
- **FIXED:** Tambah field `schools` di local-database.json
- **FIXED:** Dashboard sekarang menampilkan nama lengkap pengawas yang login dari database
- **FIXED:** Implementasi proper authentication dengan Bearer token di dashboard

### 📝 Cara Login

1. Buka browser: http://localhost:5000/login
2. Login dengan:
   - Username: `admin`
   - Password: `admin`

### 🎯 Fitur yang Tersedia

✅ Login/Logout dengan autentikasi  
✅ Dashboard dengan statistik real-time  
✅ Manajemen Tugas Satpam  
✅ Manajemen Supervisi Sekolah  
✅ Manajemen Tugas Tambahan  
✅ Data Sekolah Binaan (dengan info Kepala Sekolah)  
✅ Upload Foto Dokumentasi  
✅ Laporan Bulanan & Tahunan  
✅ Export PDF  

### 💾 Database

Aplikasi menggunakan local storage dengan file `local-database.json` yang menyimpan:
- Data pengguna
- Data tugas
- Data supervisi
- Data tugas tambahan

Data tersimpan permanen dan tidak hilang setelah restart server.
