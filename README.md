# SiskamLinked 

**Sistem Keamanan Lingkungan Terpadu** - Aplikasi web untuk manajemen keamanan lingkungan yang menghubungkan warga dengan petugas keamanan secara real-time.

## Deskripsi

SiskamLinked adalah aplikasi berbasis React yang menyediakan antarmuka untuk:
- **Warga**: Melaporkan kejadian darurat dan melihat petugas yang sedang bertugas
- **Petugas**: Melakukan check-in/check-out dan menerima penugasan
- **Admin**: Memantau laporan masuk dan menugaskan petugas ke lokasi kejadian

## Arsitektur Microservice

Aplikasi ini mengintegrasikan **2 microservice** yang berjalan secara independen:

| Service | Deskripsi | URL |
|---------|-----------|-----|
| **Patrol Service** | Manajemen petugas keamanan, absensi (check-in/out), dan penjadwalan | `http://18223066.tesatepadang.space` |
| **Incident Service** | Manajemen laporan kejadian dari warga | `http://18223070.tesatepadang.space` |

### Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    SiskamLinked Frontend                     │
│                      (React + Vite)                          │
└─────────────────────┬───────────────────┬───────────────────┘
                      │                   │
                      ▼                   ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │   Patrol Service    │ │  Incident Service   │
        │  (18223066)         │ │  (18223070)         │
        │                     │ │                     │
        │ • Officers CRUD     │ │ • Incidents CRUD    │
        │ • Check-in/out      │ │ • Report submission │
        │ • Schedules         │ │ • Assignment        │
        │ • Authentication    │ │                     │
        └─────────────────────┘ └─────────────────────┘
```

## Fitur Utama

### 1. Halaman Beranda (`/`)
- Landing page dengan akses cepat ke fitur utama
- Tombol "Laporkan Kejadian" untuk warga
- Tombol "Login Petugas" untuk admin/petugas

### 2. Lapor Kejadian (`/report`)
- Form pelaporan kejadian darurat (pencurian, kebakaran, medis, dll)
- Melihat daftar petugas yang sedang aktif bertugas
- **Fitur unggulan**: Setelah submit laporan, sistem menampilkan petugas terdekat beserta nomor telepon yang bisa langsung dihubungi

### 3. Login Petugas (`/login`)
- Autentikasi untuk petugas dan admin
- Default credentials: `admin` / `admin123`

### 4. Dashboard Pos Komando (`/dashboard`)
- Monitoring laporan masuk secara real-time
- Melihat status petugas yang sedang bertugas
- Menugaskan petugas ke laporan yang masuk
- Auto-refresh data setiap 30 detik

### 5. Sistem Absensi (`/checkinout`)
- Check-in petugas saat mulai bertugas
- Check-out petugas saat selesai bertugas
- Riwayat absensi dengan durasi kerja
- Status real-time petugas (ON DUTY / OFF DUTY)

## Tech Stack

| Technology | Version | Deskripsi |
|------------|---------|-----------|
| React | 18.x | UI Library |
| Vite | 5.x | Build Tool |
| React Router | 6.x | Routing |
| Axios | 1.x | HTTP Client |
| Tailwind CSS | 3.x | Styling |

## Instalasi & Menjalankan

### Prerequisites
- Node.js >= 18.x
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd siskamlinked-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment**
   
   Buat file `.env` di root directory:
   ```env
   VITE_PATROL_API_URL=http://18223066.tesatepadang.space
   VITE_INCIDENT_API_URL=http://18223070.tesatepadang.space
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Akses aplikasi**
   
   Buka browser dan akses `http://localhost:5173`

## Struktur Project

```
src/
├── App.jsx                 # Root component & routing
├── main.jsx               # Entry point
├── index.css              # Global styles
├── components/
│   └── Navbar.jsx         # Navigation component
├── pages/
│   ├── Dashboard.jsx      # Admin dashboard
│   ├── Login.jsx          # Login page
│   ├── Report.jsx         # Incident report form
│   └── CheckInOut.jsx     # Officer attendance
└── services/
    └── api.js             # API client configuration
```

## API Endpoints yang Digunakan

### Patrol Service (18223066)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login user |
| GET | `/officers` | Get all officers |
| GET | `/officers?status=on_duty` | Get active officers |
| POST | `/officers/:id/attendance` | Check-in/Check-out |
| GET | `/officers/:id/attendance` | Get attendance history |

### Incident Service (18223070)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/incidents` | Get all incidents |
| POST | `/incidents` | Create new incident |
| PUT | `/incidents/:id` | Update incident (assign officer) |

## Cara Penggunaan

### Untuk Warga (Public)

1. Buka halaman utama atau langsung ke `/report`
2. Isi form laporan:
   - Nama pelapor
   - Lokasi kejadian
   - Jenis kejadian
   - Deskripsi
3. Klik "KIRIM LAPORAN DARURAT"
4. Sistem akan menampilkan petugas terdekat dengan nomor telepon
5. Klik nomor telepon untuk langsung menghubungi

### Untuk Petugas

1. Login melalui `/login`
2. Akses halaman Check-in/out (`/checkinout`)
3. Klik "Check-In" saat mulai bertugas
4. Klik "Check-Out" saat selesai bertugas

### Untuk Admin

1. Login melalui `/login` (admin/admin123)
2. Akses Dashboard (`/dashboard`)
3. Monitor laporan yang masuk
4. Tugaskan petugas ke laporan dengan memilih dari dropdown
5. Pantau status petugas yang sedang aktif


## Developer

| NIM | Nama | Role |
|-----|------|------|
| 18223066 | Nazwan Siddqi Muttaqin | Patrol Service |
| 18223070 | Muhammad Refino Ramadhan | Incident Service|

---
