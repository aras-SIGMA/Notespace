# Product Requirements Document (PRD) - Notes App

## 1. Executive Summary

- **Problem Statement**: Pengguna membutuhkan aplikasi pencatatan berbasis web yang ringan, interaktif, dan mudah digunakan tanpa ketergantungan framework eksternal yang membebani performa browser.
- **Proposed Solution**: Membangun web aplikasi "Notes App" menggunakan Vanilla JavaScript, Web Components (Custom Elements), dan CSS Grid murni yang mengadaptasi estetika SaaS modern, dilengkapi validasi formulir realtime serta pencarian instan.
- **Success Criteria**:
  - Memenuhi 100% Kriteria Wajib (1-4) dan Kriteria Opsional (1-4) submission Dicoding Front-End Web.
  - Memuat seluruh data awal dari `dummy.json` (15 catatan) secara presisi pada inisialisasi pertama.
  - Bebas error dan warning pada JavaScript console browser.
  - Responsif sempurna pada viewport smartphone (>=320px), tablet (>=768px), dan desktop (>=1200px).
  - Skor performa interaksi input realtime dan render kartu catatan < 100ms.

---

## 2. User Experience & Functionality

- **User Personas**: Pengguna harian & pengembang yang ingin mencatat ide, to-do list, atau ringkasan tugas dengan antarmuka yang bersih dan bebas distraksi.
- **User Stories**:
  - _Sebagai pengguna_, saya ingin melihat daftar seluruh catatan dalam tata letak kisi (grid) agar informasi tersaji rapi dan mudah dipindai.
  - _Sebagai pengguna_, saya ingin menambahkan catatan baru melalui formulir judul dan isi catatan.
  - _Sebagai pengguna_, saya ingin mendapatkan umpan balik validasi secara langsung (realtime) saat mengisi formulir agar tidak mengirimkan data yang tidak valid.
  - _Sebagai pengguna_, saya ingin mencari catatan berdasarkan kata kunci judul secara realtime agar dapat menemukan catatan tertentu dengan cepat.
  - _Sebagai pengguna_, saya ingin menghapus atau mengarsipkan catatan agar daftar catatan tetap relevan.
- **Acceptance Criteria**:
  - **AC 1 (Daftar Catatan)**: Setiap kartu catatan menampilkan judul, isi teks, tanggal terformat bahasa Indonesia, serta penanda status.
  - **AC 2 (Formulir Catatan)**: Input teks untuk judul (dengan indikator sisa batas karakter) dan textarea untuk isi catatan.
  - **AC 3 (Validasi Realtime)**: Peringatan error visual langsung muncul ketika karakter judul kosong atau kurang dari panjang minimal, dan tombol submit dinonaktifkan sampai seluruh field valid.
  - **AC 4 (Web Components)**: Minimal 3 custom elements terdaftar dan berfungsi (`<app-bar>`, `<note-input>`, `<note-list>`, `<note-item>`).
  - **AC 5 (Custom Attributes)**: Komponen `<note-item>` mengimplementasikan `observedAttributes` dan `attributeChangedCallback` untuk memantau atribut kustom (`note-id`, `title`, `date`, `archived`).
  - **AC 6 (CSS Grid)**: Penataan daftar catatan memanfaatkan CSS Grid responsif (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`).
- **Non-Goals**:
  - Tidak menggunakan framework/library JS pihak ketiga (React, Vue, Angular, jQuery).
  - Tidak menyertakan dependensi `node_modules` atau build-step kompleks (Vite/Webpack) di dalam bundle akhir submission.
  - Tidak memerlukan server backend eksternal (arsitektur client-side in-memory dengan fallback localStorage).

---

## 3. AI System Requirements

- **Status**: Not Applicable (aplikasi web murni front-end berbasis standar W3C Web Components).

---

## 4. Technical Specifications

- **Architecture Overview**:
  - Pola: Modular ES6 Modules (`type="module"`), Model-View berbasis Custom Elements terisolasi, State Management terpusat dengan Event Dispatcher kustom.
  - Komponen Utama:
    - `<app-bar>`: Header aplikasi, branding, input pencarian instan, dan kontrol aksi.
    - `<app-sidebar>`: Navigasi kategori catatan (Semua, Aktif, Arsip).
    - `<note-input>`: Form penambahan catatan dengan realtime event listener & custom validation feedback.
    - `<note-list>`: Kontainer CSS Grid yang merender koleksi `<note-item>`.
    - `<note-item>`: Representasi individual kartu catatan berbasis custom attributes.
- **Integration Points**:
  - `src/data/notes-data.js`: Sumber data dumi catatan yang disinkronkan dari `dummy.json`.
  - Browser Storage API: Sinkronisasi mutasi state ke `localStorage` agar data tetap persisten saat halaman direfresh.
- **Security & Privacy**:
  - Pencegahan serangan Cross-Site Scripting (XSS) dengan merender konten pengguna menggunakan `textContent` atau sanitasi string HTML sebelum insersi DOM.
  - 100% data tersimpan di browser klien tanpa transmisi jaringan pihak ketiga.

---

## 5. Risks & Roadmap

- **Phased Rollout**:
  - **Fase 1 (Scaffolding & Data)**: Setup struktur folder, ekstraksi data dumi ke modul JavaScript, dan styling reset.
  - **Fase 2 (Web Components & Grid)**: Registrasi `<app-bar>`, `<note-input>`, `<note-list>`, `<note-item>`, dan integrasi CSS Grid.
  - **Fase 3 (Interaktivitas & Validasi Realtime)**: Logika penambahan catatan, validasi realtime pada formulir, dan penghitung karakter.
  - **Fase 4 (Pencarian & Arsip/Hapus)**: Fitur search filter instan dan mutasi status catatan.
  - **Fase 5 (Testing & Verifikasi Kriteria)**: Audit kriteria Dicoding, uji responsive layar, dan kesesuaian token desain.
- **Technical Risks & Mitigation**:
  - _Risiko_: Komponen tidak merender jika script dieksekusi sebelum DOM siap.
    - _Mitigasi_: Menggunakan `defer` atau `type="module"` pada pemanggilan script di `index.html`.
  - _Risiko_: Memory leak akibat event listener berulang pada custom elements.
    - _Mitigasi_: Pasang pembersihan event listener di `disconnectedCallback` bila diperlukan.
