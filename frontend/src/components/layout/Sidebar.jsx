import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
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
  // Check if pathname starts with the route for partial active matching
  const isActive = location.pathname.startsWith(to) && to !== '/' || location.pathname === to; 
  
  // Custom check for the root path
  if (to === '/' && location.pathname === '/home') {
    // If we're on the /home dashboard, keep the home link highlighted
    isActive = true;
  }
  
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

  // --- CLEAN CONTEXT LOGOUT ---
  const handleLogout = () => {
    logout(); // This clears the session and redirects to /landing
  };

  const handleFundsSuccess = () => {
    fetchWalletBalance(); // Re-fetch balance
  };

  return (
    <> 
      <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 text-white"> {/* Dark Background */}
        <h2 className="text-3xl font-bold text-green-400 mb-8 px-4">Investify</h2>
        
        <nav className="flex-1 space-y-2">
          {/* --- ADDED HOME LINK --- */}
          <NavLink to="/home" icon={<FaHome size={18} />}>
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

          {/* --- LOGOUT BUTTON USES CONTEXT HANDLER --- */}
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