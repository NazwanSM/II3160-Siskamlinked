import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CheckInOut from './pages/CheckInOut';

const Home = () => (
  <div className="min-h-screen bg-siskam-green flex flex-col items-center justify-center text-white text-center p-6">
    <div className="max-w-2xl">
      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">SiskamLinked</h1>
      <p className="text-lg md:text-xl mb-10 text-white/80 max-w-md mx-auto">
        Sistem Keamanan Lingkungan Terpadu. Warga Aman, Petugas Sigap.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/report" 
          className="bg-red-600 hover:bg-red-700 px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Laporkan Kejadian
        </a>
        <a 
          href="/login" 
          className="bg-white/10 hover:bg-white/20 border border-white/30 px-8 py-3.5 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Login Petugas
        </a>
      </div>
    </div>
    
    <div className="absolute bottom-6 text-white/50 text-sm">
      Keamanan Lingkungan Terpadu
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkinout" element={<CheckInOut />} />
      </Routes>
    </BrowserRouter>
  );
}