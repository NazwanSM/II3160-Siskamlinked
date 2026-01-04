import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [officers, setOfficers] = useState([]);
  const navigate = useNavigate();

  // Load Data saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Data Insiden (Service Kamu)
        const incidentData = await api.getAllIncidents();
        setIncidents(incidentData || []);

        // 2. Ambil Data Petugas Aktif (Service Teman)
        const officerData = await api.getActiveOfficers();
        setOfficers(officerData || []);
      } catch (err) {
        console.error("Gagal load data, mungkin belum login?", err);
        // Jika gagal auth, lempar ke login
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleAssign = async (incidentId, officerId) => {
    // Cari data petugas lengkap berdasarkan ID yang dipilih
    const officer = officers.find(o => o.id == officerId);
    if (!officer) return;

    try {
      // Panggil API PUT kamu
      await api.assignOfficer(incidentId, officer);
      alert(`Petugas ${officer.name} berhasil ditugaskan!`);
      // Refresh data insiden
      const updated = await api.getAllIncidents();
      setIncidents(updated);
    } catch (err) {
      alert("Gagal menugaskan petugas");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-siskam-green mb-6 border-b-4 border-siskam-brown w-fit pb-1">
          Pos Komando
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KOLOM KIRI: Petugas (Dari API Teman) */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-siskam-brown h-fit">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              👮‍♂️ Petugas Jaga <span className="text-xs bg-red-500 text-white px-2 rounded-full animate-pulse">LIVE</span>
            </h3>
            {officers.length === 0 ? <p className="text-gray-500 italic">Tidak ada petugas aktif.</p> : (
              <ul className="space-y-2">
                {officers.map(off => (
                  <li key={off.id} className="p-3 bg-green-50 rounded flex justify-between items-center">
                    <span className="font-semibold">{off.name}</span>
                    <span className="text-xs bg-siskam-green text-white px-2 py-1 rounded font-bold">ON DUTY</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* KOLOM KANAN: Laporan Warga (Dari API Kamu) */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold mb-4">🔥 Laporan Masuk</h3>
            {incidents.length === 0 && <p className="text-gray-500">Belum ada laporan masuk.</p>}
            
            {incidents.map(inc => (
              <div key={inc.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${inc.status === 'OPEN' ? 'bg-red-500' : 'bg-blue-600'}`}>
                      {inc.status}
                    </span>
                    <h4 className="font-bold text-lg text-siskam-green">{inc.incident_type}</h4>
                  </div>
                  <p className="font-semibold text-gray-700">📍 {inc.location}</p>
                  <p className="text-gray-600 text-sm mt-1">"{inc.description}" — <span className="italic">Pelapor: {inc.reporter_name}</span></p>
                  
                  {inc.assigned_officer_name && (
                    <div className="mt-3 inline-block bg-blue-50 px-3 py-1 rounded text-sm text-blue-800 font-semibold border border-blue-200">
                      ✅ Ditangani: {inc.assigned_officer_name}
                    </div>
                  )}
                </div>

                {/* Dropdown Penugasan (Hanya jika status OPEN) */}
                {inc.status === 'OPEN' && (
                  <div className="mt-4 md:mt-0 md:ml-4 min-w-[200px]">
                    <label className="text-xs text-gray-500 font-bold">PILIH PETUGAS:</label>
                    <select 
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-siskam-green"
                      onChange={(e) => handleAssign(inc.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Tugaskan --</option>
                      {officers.map(off => (
                        <option key={off.id} value={off.id}>{off.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}