import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaFeatherAlt, FaSearch, FaAngleDown, FaCalculator, FaChartLine, FaClipboardList, FaStore } from 'react-icons/fa'; // Import icons

function PublicNavbar() {
  const { user } = useAuth();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700 relative z-20"> {/* Dark theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Logo + Primary Nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <FaFeatherAlt className="text-green-400 h-8 w-8" />
              <span className="text-2xl font-bold text-white">Investify</span>
            </Link>

            {/* Primary Nav Links */}
            <div className="hidden md:flex space-x-6">
              <Link to="/market" className="text-gray-300 hover:text-white font-medium">
                Stocks
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white font-medium">
                F&O
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white font-medium">
                Mutual Funds
              </Link>
              
              {/* More Button */}
              <div className="relative">
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  onMouseEnter={() => setIsMoreMenuOpen(true)} // Open on hover
                  className="flex items-center text-gray-300 hover:text-white font-medium"
                >
                  <span>More</span>
                  <FaAngleDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Search + Auth */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Investify..."
                className="hidden lg:block w-72 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="hidden lg:block absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            {/* Auth Buttons */}
            {user ? (
              <Link
                to="/home" // Link to their main app page
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-400"
              >
                Go to Home
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-400"
              >
                Login / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- Mega Menu Dropdown --- */}
      {isMoreMenuOpen && (
        <div 
          onMouseLeave={() => setIsMoreMenuOpen(false)} // Close on mouse leave
          className="absolute left-0 right-0 w-full bg-gray-800 shadow-lg border-t border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <MegaMenuLink icon={<FaCalculator />} title="SIP Calculator" description="Estimate returns on a SIP" />
              <MegaMenuLink icon={<FaChartLine />} title="Stock Screener" description="Filter based on PE, ratios" />
            </div>
            {/* Column 2 */}
            <div>
              <MegaMenuLink icon={<FaClipboardList />} title="IPO" description="Track upcoming IPOs" />
              <MegaMenuLink icon={<FaStore />} title="Commodities" description="Trade Gold, Silver, etc." />
            </div>
            {/* You can add Column 3 & 4 here */}
          </div>
        </div>
      )}
    </nav>
  );
}

// Helper component for the links inside the mega menu
const MegaMenuLink = ({ icon, title, description }) => (
  <Link to="#" className="flex items-start p-3 rounded-lg hover:bg-gray-700">
    <div className="flex-shrink-0 text-green-400">{React.cloneElement(icon, { size: 24 })}</div>
    <div className="ml-4">
      <p className="text-base font-medium text-white">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  </Link>
);

export default PublicNavbar;