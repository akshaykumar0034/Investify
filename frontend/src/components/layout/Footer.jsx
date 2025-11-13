import React from 'react';
import { Link } from 'react-router-dom';
import { FaFeatherAlt } from 'react-icons/fa';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Social icons

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 border-t border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Logo & Address */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaFeatherAlt className="text-green-400 h-8 w-8" />
              <span className="text-2xl font-bold text-white">Investify</span>
            </div>
            <p className="text-sm">
              Investify Tech Park, 3rd Floor
              <br />
              Sometown, Bengaluru - 560100
              <br />
              Karnataka
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Investify</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="#" className="text-base hover:text-white">About Us</Link></li>
              <li><Link to="#" className="text-base hover:text-white">Blog</Link></li>
              <li><Link to="#" className="text-base hover:text-white">Careers</Link></li>
              <li><Link to="#" className="text-base hover:text-white">Media & Press</Link></li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Products</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/market" className="text-base hover:text-white">Stocks</Link></li>
              <li><Link to="#" className="text-base hover:text-white">ETFs</Link></li>
              <li><Link to="#" className="text-base hover:text-white">Mutual Funds</Link></li>
              <li><Link to="#" className="text-base hover:text-white">IPO</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="#" className="text-base hover:text-white">Help & Support</Link></li>
              <li><Link to="#" className="text-base hover:text-white">Trust & Safety</Link></li>
              <li><Link to="#" className="text-base hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">&copy; 2025 Investify. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-300"><FaGithub size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-gray-300"><FaLinkedin size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-gray-300"><FaTwitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;