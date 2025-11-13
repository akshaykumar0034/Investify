import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// --- 1. IMPORT ALL ICONS (including FaHome) ---
import { 
  FaHome, // <-- Added
  FaChartPie, 
  FaEye, 
  FaSearchDollar, 
  FaSignOutAlt, 
  FaPlusCircle, 
  FaBook 
} from 'react-icons/fa'; 
import { useAuth } from '../../context/AuthContext';
import AddFundsModal from '../AddFundsModal'; 

const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeClass}`}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </Link>
  );
};

function Sidebar() {
  const { logout, walletBalance, fetchWalletBalance } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
  };

  const handleFundsSuccess = () => {
    fetchWalletBalance(); // Re-fetch balance
  };

  return (
    <> 
      <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 text-white">
        <h2 className="text-3xl font-bold text-green-400 mb-8 px-4">Investify</h2>
        
        {/* --- 2. UPDATED NAVIGATION (with "Home" link) --- */}
        <nav className="flex-1 space-y-2">
          <NavLink to="/" icon={<FaHome size={18} />}>
            Home
          </NavLink>
          <NavLink to="/dashboard" icon={<FaChartPie size={18} />}>
            Dashboard
          </NavLink>
          <NavLink to="/orders" icon={<FaBook size={18} />}>
            Orders
          </NavLink>
          <NavLink to="/watchlist" icon={<FaEye size={18} />}>
            Watchlist
          </NavLink>
          <NavLink to="/market" icon={<FaSearchDollar size={18} />}>
            Market
          </NavLink>
        </nav>
        {/* --- END OF UPDATED NAVIGATION --- */}

        {/* --- WALLET SECTION (Unchanged) --- */}
        <div className="mt-auto space-y-4">
          <div className="px-4">
            <h4 className="text-xs text-gray-400">AVAILABLE FUNDS</h4>
            <p className="text-2xl font-semibold text-green-400">
              ${(walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <FaPlusCircle size={18} />
            <span className="ml-3">Add Funds</span>
          </button>
          {/* --- END WALLET SECTION --- */}

          {/* Logout Button (Unchanged) */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <FaSignOutAlt size={18} />
            <span className="ml-3">Log Out</span>
          </button>
        </div>
      </div>

      {/* Render the modal if open (Unchanged) */}
      {isModalOpen && (
        <AddFundsModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleFundsSuccess}
        />
      )}
    </>
  );
}

export default Sidebar;