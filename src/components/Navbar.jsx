import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-siskam-green flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          SiskamLinked
        </Link>
        <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
          <Link to="/" className="text-gray-600 hover:text-siskam-green px-3 py-2 rounded-lg hover:bg-gray-50 transition">
            Beranda
          </Link>
          <Link to="/report" className="text-gray-600 hover:text-siskam-green px-3 py-2 rounded-lg hover:bg-gray-50 transition">
            Lapor
          </Link>
          <Link to="/checkinout" className="text-gray-600 hover:text-siskam-green px-3 py-2 rounded-lg hover:bg-gray-50 transition hidden sm:block">
            Absensi
          </Link>
          <Link to="/dashboard" className="bg-siskam-green text-white px-4 py-2 rounded-lg hover:bg-siskam-lightGreen transition font-medium">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}