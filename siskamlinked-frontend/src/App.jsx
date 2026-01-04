import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const Home = () => (
  <div className="h-screen bg-siskam-green flex flex-col items-center justify-center text-white text-center p-4">
    <h1 className="text-6xl font-bold mb-4">SiskamLinked</h1>
    <p className="text-xl mb-8 max-w-lg">Sistem Keamanan Lingkungan Terpadu. Warga Aman, Petugas Sigap.</p>
    <div className="flex gap-4">
      <a href="/report" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-lg shadow-lg">🚨 TOMBOL PANIK</a>
      <a href="/login" className="bg-siskam-brown hover:bg-opacity-90 px-8 py-3 rounded-full font-bold text-lg shadow-lg">Login Petugas</a>
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
      </Routes>
    </BrowserRouter>
  );
}