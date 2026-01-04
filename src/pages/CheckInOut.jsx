import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function CheckInOut() {
    const [officers, setOfficers] = useState([]);
    const [history, setHistory] = useState([]);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
        const [officerData, historyData] = await Promise.all([
            api.getAllOfficers(),
            api.getCheckHistory()
        ]);
        setOfficers(officerData || []);
        setHistory(historyData || []);
        } catch (err) {
        console.error("Gagal load data:", err);
        if (err.response?.status === 401) {
            navigate('/login');
        }
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckIn = async (officerId, officerName) => {
        if (!confirm(`Check-in petugas ${officerName}?`)) return;
        
        setLoading(true);
        try {
        await api.checkIn(officerId, 'Pos Keamanan', 'Check-in via web app');
        setMsg({ type: 'success', text: `${officerName} berhasil check-in!` });
        await fetchData();
        setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (err) {
        setMsg({ type: 'error', text: `Gagal check-in: ${err.response?.data?.message || err.message}` });
        } finally {
        setLoading(false);
        }
    };

    const handleCheckOut = async (officerId, officerName) => {
        if (!confirm(`Check-out petugas ${officerName}?`)) return;
        
        setLoading(true);
        try {
        await api.checkOut(officerId, 'Pos Keamanan', 'Check-out via web app');
        setMsg({ type: 'success', text: `${officerName} berhasil check-out!` });
        await fetchData();
        setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (err) {
        setMsg({ type: 'error', text: `Gagal check-out: ${err.response?.data?.message || err.message}` });
        } finally {
        setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
        });
    };

    const activeOfficers = officers.filter(o => o.status?.toUpperCase() === 'ON_DUTY');
    const offDutyOfficers = officers.filter(o => o.status?.toUpperCase() !== 'ON_DUTY');

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 lg:px-6 py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sistem Absensi Petugas</h2>
                <p className="text-gray-500 mt-1">Kelola check-in dan check-out petugas</p>
            </div>

            {msg.text && (
                <div className={`mb-6 p-4 rounded-lg border ${
                msg.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                <p className="font-medium">{msg.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-green-600 px-5 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-white">Sedang Bertugas</h3>
                    <span className="flex items-center gap-1.5 text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    {activeOfficers.length} Aktif
                    </span>
                </div>
                
                <div className="p-4 max-h-[40vh] overflow-y-auto">
                    {activeOfficers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">Belum ada petugas yang bertugas.</p>
                    ) : (
                    <div className="space-y-3">
                        {activeOfficers.map(officer => (
                        <div key={officer.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                                {officer.position && (
                                <p className="text-xs text-gray-500 mt-0.5">{officer.position}</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleCheckOut(officer.id, officer.name)}
                                disabled={loading}
                                className="shrink-0 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:bg-gray-400 transition"
                            >
                                Check-Out
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-500 px-5 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-white">Tidak Bertugas</h3>
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    {offDutyOfficers.length} Standby
                    </span>
                </div>
                
                <div className="p-4 max-h-[40vh] overflow-y-auto">
                    {offDutyOfficers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">Semua petugas sedang bertugas.</p>
                    ) : (
                    <div className="space-y-3">
                        {offDutyOfficers.map(officer => (
                        <div key={officer.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                                {officer.position && (
                                <p className="text-xs text-gray-500 mt-0.5">{officer.position}</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleCheckIn(officer.id, officer.name)}
                                disabled={loading}
                                className="shrink-0 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 disabled:bg-gray-400 transition"
                            >
                                Check-In
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Riwayat Absensi</h3>
                </div>
                
                <div className="overflow-x-auto">
                {history.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">Belum ada riwayat absensi.</p>
                ) : (
                    <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Petugas</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Check-In</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Check-Out</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Durasi</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.slice(0, 10).map((log, idx) => {
                        const duration = log.check_out_time 
                            ? Math.round((new Date(log.check_out_time) - new Date(log.check_in_time)) / 1000 / 60)
                            : null;
                        
                        return (
                            <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{log.officer_name}</td>
                            <td className="px-4 py-3 text-gray-600">{formatDateTime(log.check_in_time)}</td>
                            <td className="px-4 py-3 text-gray-600">{log.check_out_time ? formatDateTime(log.check_out_time) : '-'}</td>
                            <td className="px-4 py-3 text-gray-600">{duration ? `${duration} menit` : '-'}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                log.check_out_time 
                                    ? 'bg-gray-100 text-gray-600' 
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                {log.check_out_time ? 'Selesai' : 'Aktif'}
                                </span>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                Data akan otomatis diperbarui setiap 5 detik. Petugas dengan status ON DUTY telah melakukan check-in.
                </p>
            </div>
            </div>
        </div>
        </>
    );
}