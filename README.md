# Notes App (Submission 2)

Aplikasi pencatatan berbasis web yang dibangun menggunakan Vanilla JavaScript, Web Components (Custom Elements), CSS Grid Layout, Webpack module bundler, serta terhubung langsung ke RESTful Notes API Dicoding (v2).

---

## Fitur Utama & Kriteria Submission

### 1. Kriteria Wajib

- **Kriteria Wajib 1 (Mempertahankan Submission Sebelumnya)**: Tetap mengadopsi Web Components kustom (`<app-bar>`, `<app-sidebar>`, `<note-input>`, `<note-item>`, `<note-list>`), CSS Grid layout responsif, dan validasi form realtime.
- **Kriteria Wajib 2 (RESTful API)**: Seluruh data bersumber langsung dari RESTful API `https://notes-api.dicoding.dev/v2` (tambah catatan, tampilkan catatan aktif & arsip, serta hapus catatan). Data lokal/dumi tidak lagi digunakan.
- **Kriteria Wajib 3 (Webpack Module Bundler)**:
  - Menggunakan `html-webpack-plugin`.
  - Mode development: `npm run start-dev` (menggunakan `webpack-dev-server`).
  - Mode production: `npm run build` (menggunakan konfigurasi `webpack.prod.js`).
- **Kriteria Wajib 4 (Fetch API)**: Seluruh pertukaran data asinkron menggunakan standar `fetch()`.
- **Kriteria Wajib 5 (Indikator Loading)**: Menampilkan status proses asinkron HTTP melalui Web Component `<loading-indicator>`.

### 2. Kriteria Opsional (Target Skor Bintang 5)

- **Kriteria Opsional 1 (Fitur Arsip Catatan)**: Mengimplementasikan arsip dan pengembalian catatan aktif dari endpoint `/notes/{id}/archive` dan `/notes/{id}/unarchive`.
- **Kriteria Opsional 2 (Feedback Error & Notifikasi)**: Menampilkan pesan interaktif dan konfirmasi menggunakan library **SweetAlert2**.
- **Kriteria Opsional 3 (Animasi Halus)**: Menerapkan animasi pergerakan halus pada kartu catatan menggunakan library **Anime.js**.
- **Kriteria Opsional 4 (Prettier Code Formatter)**: Dilengkapi berkas konfigurasi `.prettierrc` dan script `npm run format`.

---

## Struktur Berkas

```
notes-app/
├── dist/                  # Output hasil build Webpack (production)
├── src/
│   ├── api.js             # Modul Fetch API ke Dicoding Notes API v2
│   ├── app.js             # Entry point aplikasi & state orchestration
│   └── components.js      # Definisi seluruh Web Components
├── index.html             # Template HTML
├── style.css              # Sistem token desain & stylesheet terpadu
├── webpack.common.js      # Konfigurasi dasar Webpack & HtmlWebpackPlugin
├── webpack.dev.js         # Konfigurasi dev server Webpack
├── webpack.prod.js        # Konfigurasi optimasi build production Webpack
├── .prettierrc            # Konfigurasi format kode Prettier
├── .gitignore             # Daftar berkas/folder yang diabaikan Git
├── package.json           # Konfigurasi package & scripts
└── README.md              # Dokumentasi proyek
```

---

## Cara Menjalankan Aplikasi

1. **Instalasi Dependensi**:

   ```bash
   npm install
   ```

2. **Menjalankan Dev Server**:

   ```bash
   npm run start-dev
   ```

   Aplikasi akan terbuka otomatis di browser pada `http://localhost:8080`.

3. **Membangun Bundle Production**:

   ```bash
   npm run build
   ```

   Hasil bundle tersimpan di direktori `dist/`.

4. **Format Kode**:
   ```bash
   npm run format
   ```
