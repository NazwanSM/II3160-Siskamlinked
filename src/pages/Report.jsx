import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';

export default function Report() {
  const [form, setForm] = useState({ reporter_name: '', location: '', incident_type: 'Theft', description: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [officers, setOfficers] = useState([]);
  const [nearestOfficer, setNearestOfficer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const officerData = await api.getActiveOfficers();
        setOfficers(officerData || []);
      } catch (err) {
        console.error("Gagal memuat data petugas:", err);
      }
    };
    fetchOfficers();
    const interval = setInterval(fetchOfficers, 30000);
    return () => clearInterval(interval);
  }, []);

  const findNearestOfficer = (incidentLocation) => {
    if (!officers.length) return null;
    
    const locationLower = incidentLocation.toLowerCase();

    const sameLocation = officers.find(o => 
      o.location?.toLowerCase().includes(locationLower) || 
      locationLower.includes(o.location?.toLowerCase() || '')
    );
    if (sameLocation) return sameLocation;

    const locationParts = locationLower.split(/[\s,]+/);
    for (const part of locationParts) {
      if (part.length < 2) continue;
      const match = officers.find(o => o.location?.toLowerCase().includes(part));
      if (match) return match;
    }

    return officers[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    setNearestOfficer(null);

    try {
      await api.createIncident(form);
      
      const nearest = findNearestOfficer(form.location);
      setNearestOfficer(nearest);
      
      setStatus({ 
        type: 'success', 
        message: 'Laporan berhasil dikirim! Petugas akan segera merespon.' 
      });
      setForm({ reporter_name: '', location: '', incident_type: 'Theft', description: '' });
    } catch (err) { 
      setStatus({ type: 'error', message: 'Gagal mengirim laporan. Silakan coba lagi.' }); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-red-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Lapor Kejadian Darurat</h2>
                  <p className="text-red-100 text-sm mt-1">Isi form di bawah untuk melaporkan kejadian</p>
                </div>

                <div className="p-6">
                  {status.message && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                      status.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <p className="font-medium">{status.message}</p>
                    </div>
                  )}

                  {nearestOfficer && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-bold text-blue-900 mb-2">Petugas Terdekat</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{nearestOfficer.name}</p>
                          {nearestOfficer.position && (
                            <p className="text-sm text-gray-600">{nearestOfficer.position}</p>
                          )}
                          {nearestOfficer.location && (
                            <p className="text-sm text-gray-600">Lokasi: {nearestOfficer.location}</p>
                          )}
                        </div>
                        {nearestOfficer.phone_number && (
                          <a 
                            href={`tel:${nearestOfficer.phone_number}`}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {nearestOfficer.phone_number}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                      <input 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
                        placeholder="Masukkan nama Anda"
                        value={form.reporter_name} 
                        onChange={e => setForm({...form, reporter_name: e.target.value})} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kejadian</label>
                      <input 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
                        placeholder="Contoh: Blok A, Gedung Utama, Gate 2"
                        value={form.location} 
                        onChange={e => setForm({...form, location: e.target.value})} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kejadian</label>
                      <select 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-white" 
                        value={form.incident_type} 
                        onChange={e => setForm({...form, incident_type: e.target.value})}
                      >
                        <option value="Theft">Pencurian</option>
                        <option value="Fire">Kebakaran</option>
                        <option value="Medical">Keadaan Darurat Medis</option>
                        <option value="Vandalism">Vandalisme</option>
                        <option value="Suspicious">Aktivitas Mencurigakan</option>
                        <option value="Other">Lainnya</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kejadian</label>
                      <textarea 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none" 
                        rows={4}
                        placeholder="Jelaskan kronologi singkat kejadian..."
                        value={form.description} 
                        onChange={e => setForm({...form, description: e.target.value})}
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Mengirim...
                        </>
                      ) : 'KIRIM LAPORAN DARURAT'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20 overflow-hidden">
                <div className="bg-siskam-green px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Petugas Aktif</h3>
                  <span className="flex items-center gap-1.5 text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {officers.length} Online
                  </span>
                </div>
                
                <div className="p-4">
                  {officers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Tidak ada petugas aktif saat ini.</p>
                  ) : (
                    <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {officers.map(officer => (
                        <li key={officer.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{officer.name}</p>
                              {officer.position && <p className="text-xs text-gray-500">{officer.position}</p>}
                            </div>
                            <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Aktif</span>
                          </div>
                          
                          {officer.phone_number && (
                            <a 
                              href={`tel:${officer.phone_number}`}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition mt-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {officer.phone_number}
                            </a>
                          )}
                          
                          {officer.location && (
                            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {officer.location}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-600">
                      Klik nomor telepon untuk menghubungi petugas secara langsung.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}