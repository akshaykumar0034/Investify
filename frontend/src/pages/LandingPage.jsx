import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

function LandingPage() {
  return (
    // Use bg-gray-900 like the rest of your app
    <div className="text-white bg-gray-900 min-h-screen relative overflow-hidden">
      {/* --- Background Illustration (SVG-like) --- */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0"> {/* Reduced opacity */}
        <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
          {/* Subtle gradient for the sky/background */}
          <defs>
            <linearGradient id="gradient-bg" x1="0" y1="0" x2="1440" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A90E2"/> {/* Brighter Blue */}
              <stop offset="1" stopColor="#50E3C2"/> {/* Brighter Green/Teal */}
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gradient-bg)"/>
          {/* Simple building shapes */}
          <path d="M100 800L100 400L150 400L150 800L100 800ZM200 800L200 300L250 300L250 800L200 800ZM300 800L300 500L350 500L350 800L300 800Z" fill="#313742"/>
          <path d="M1100 800L1100 350L1150 350L1150 800L1100 800ZM1200 800L1200 250L1250 250L1250 800L1200 800ZM1300 800L1300 450L1350 450L1350 800L1300 800Z" fill="#313742"/>
          <circle cx="900" cy="150" r="30" fill="#313742"/>
          <rect x="700" y="50" width="80" height="80" fill="#313742"/>
        </svg>
      </div>
      {/* --- END Background Illustration --- */}


      {/* --- Hero Section --- */}
      <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Invest in your wealth
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          Built for a new generation of investors. A modern, fast, and secure platform for all your trading and investment needs.
        </p>
        <Link
          to="/register"
          className="mt-10 px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg text-lg hover:bg-green-400"
        >
          Get Started
        </Link>
      </div>

      {/* --- Indian Markets at Your Fingertips Section --- */}
      <div className="bg-gray-900 py-16 relative z-10"> {/* Changed to dark */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text and Feature List */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Indian markets at <br /> your fingertips.
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-md">
              Long-term or short-term, high risk or low risk. Be the kind of investor you want to be.
            </p>

            {/* Feature List */}
            <ul className="space-y-6">
              <li className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-xl text-white font-medium">Stocks & Intraday</span>
                <FaArrowRight className="text-gray-500" />
              </li>
              <li className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-xl text-white font-medium">Mutual funds & SIPs</span>
                <FaArrowRight className="text-gray-500" />
              </li>
              <li className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-xl text-white font-medium">Futures & Options</span>
                <FaArrowRight className="text-gray-500" />
              </li>
              <li className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-xl text-white font-medium">Commodities</span>
                <FaArrowRight className="text-gray-500" />
              </li>
            </ul>
          </div>

          {/* Right Side: Mobile App Mockup with Chart */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-[500px] bg-gray-800 border-4 border-gray-700 rounded-[2.5rem] shadow-2xl overflow-hidden p-2"> {/* Darker frame */}
              {/* Phone Notch/Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20"></div>
              {/* Content within the phone */}
              <div className="relative w-full h-full bg-gray-900 rounded-[2rem] flex flex-col justify-between items-center text-gray-300 text-xs p-3">
                {/* Header within phone */}
                <div className="w-full text-center py-2">
                  <span className="text-sm font-semibold">Stock Details</span>
                </div>
                {/* Stock Info */}
                <div className="w-full text-left mb-2">
                    <p className="text-lg font-bold text-green-400">AAPL</p>
                    <p className="text-sm">₹175.45 <span className="text-green-500">+1.23%</span></p>
                </div>
                {/* Placeholder Stock Chart */}
                <div className="w-full h-40 bg-gray-800 rounded-lg flex items-end p-2">
                  <div className="flex w-full h-full items-end justify-around space-x-1">
                    <div className="w-2 bg-green-500 h-2/5 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-3/5 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-2/4 rounded-sm"></div>
                    <div className="w-2 bg-red-500 h-4/5 rounded-sm"></div>
                    <div className="w-2 bg-red-500 h-3/4 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-1/2 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-3/5 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-1/4 rounded-sm"></div>
                    <div className="w-2 bg-red-500 h-2/5 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-3/5 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-2/4 rounded-sm"></div>
                    <div className="w-2 bg-green-500 h-4/5 rounded-sm"></div>
                  </div>
                </div>
                {/* Some mock buttons */}
                <div className="w-full flex justify-around mt-4">
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md text-xs">Buy</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-md text-xs">Sell</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Finance Simplified Section --- */}
      <div className="bg-gray-800 py-24 relative z-10"> {/* Changed to dark */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Finance simplified, <br /> in your language.
          </h2>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              to="#"
              className="flex items-center space-x-2 px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
            >
              <span>YouTube</span>
              <FaArrowRight />
            </Link>
            <Link
              to="#"
              className="flex items-center space-x-2 px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
            >
              <span>Investify Digest</span>
              <FaArrowRight />
            </Link>
          </div>

          {/* --- Content Cards Section (Dark) --- */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold text-white mb-3">News Highlight</h3>
              <p className="text-gray-400 text-base">
                More than half of Nifty 50 stocks ended in the green. 7 Nifty sectors ended in the green, with banking and financial services gaining the most.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold text-white mb-3">Momentum in stocks</h3>
              <p className="text-gray-400 text-base">
                Discover stocks with strong momentum using our expert analysis.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold text-white mb-3">Word of the day</h3>
              <p className="text-gray-400 text-base">
                Additional Surveillance Measure (ASM) refers to an initiative taken by SEBI and exchanges to protect investor interest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;