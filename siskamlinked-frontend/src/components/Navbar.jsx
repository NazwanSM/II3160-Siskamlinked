import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-siskam-green text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          👮‍♂️ SiskamLinked
        </Link>
        <div className="space-x-1 md:space-x-4 text-sm md:text-base">
          <Link to="/" className="hover:text-siskam-lightBrown px-2">Beranda</Link>
          <Link to="/report" className="hover:text-siskam-lightBrown px-2">Lapor!</Link>
          <Link to="/dashboard" className="bg-siskam-brown px-4 py-2 rounded hover:bg-opacity-90 transition">
            Pos Jaga (Admin)
          </Link>
        </div>
      </div>
    </nav>
  );
}