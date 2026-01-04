import { useState } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';

export default function Report() {
  const [form, setForm] = useState({ reporter_name: '', location: '', incident_type: 'Theft', description: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createIncident(form);
      setMsg('✅ Laporan terkirim!');
      setForm({ reporter_name: '', location: '', incident_type: 'Theft', description: '' });
    } catch (err) { setMsg('❌ Gagal kirim laporan.'); }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow border-t-4 border-red-600">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🚨 Lapor Kejadian</h2>
        {msg && <p className="mb-4 p-2 bg-gray-100 rounded text-center font-bold">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Nama Anda" value={form.reporter_name} onChange={e => setForm({...form, reporter_name: e.target.value})} required />
          <input className="w-full p-2 border rounded" placeholder="Lokasi (misal: Blok A)" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
          <select className="w-full p-2 border rounded" value={form.incident_type} onChange={e => setForm({...form, incident_type: e.target.value})}>
            <option value="Theft">Pencurian</option> <option value="Fire">Kebakaran</option> <option value="Medical">Medis</option>
          </select>
          <textarea className="w-full p-2 border rounded" placeholder="Kronologi Singkat..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
          <button className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">KIRIM SOS</button>
        </form>
      </div>
    </>
  );
}