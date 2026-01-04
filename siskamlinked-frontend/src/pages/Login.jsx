import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.login(user, pass);
      navigate('/dashboard');
    } catch (err) { alert('Login Gagal! Coba: admin / admin123'); }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-siskam-bg">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-lg w-80 border-t-4 border-siskam-green">
        <h1 className="text-2xl font-bold text-center mb-6 text-siskam-green">Login Petugas</h1>
        <input className="w-full p-2 border rounded mb-3" placeholder="Username" value={user} onChange={e=>setUser(e.target.value)} />
        <input className="w-full p-2 border rounded mb-6" type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="w-full bg-siskam-green text-white py-2 rounded font-bold hover:bg-siskam-lightGreen">MASUK</button>
      </form>
    </div>
  );
}