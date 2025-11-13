import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
      <h2 className="text-4xl font-bold text-white mb-4">Invest, trade, and track markets.</h2>
      <p className="text-lg text-gray-300 mb-6">Your all-in-one platform for simulated stock trading and portfolio management.</p>
      <div className="flex justify-center space-x-4">
        <Link 
          to="/register"
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400"
        >
          Open an Account
        </Link>
        <Link 
          to="/login"
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;