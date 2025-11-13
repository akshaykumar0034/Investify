import React, { useState, useEffect } from 'react';
// --- 1. IMPORT THE CORRECT SERVICES ---
import { placeOrder } from '../api/orderService'; 
import { getQuote } from '../api/marketService'; // This now uses Finnhub
import { useAuth } from '../context/AuthContext'; 

function TradeModal({ onClose, onSuccess }) {
  const [tradeType, setTradeType] = useState('BUY'); // 'BUY' or 'SELL'
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  
  // --- 2. STATE FOR ORDER TYPE ---
  const [orderType, setOrderType] = useState('MARKET'); // 'MARKET' or 'LIMIT'
  const [limitPrice, setLimitPrice] = useState('');
  
  const { fetchWalletBalance } = useAuth();
  
  // --- 3. THIS useEffect IS CORRECT ---
  // It fetches the Finnhub quote object and uses 'res.data.c'
  useEffect(() => {
    if (ticker.length > 1) {
      setLoadingPrice(true);
      const timer = setTimeout(async () => {
        try {
          const res = await getQuote(ticker.toUpperCase());
          if (!res.data || res.data.c === 0) { // Check for valid data
             throw new Error("Invalid ticker");
          }
          setPrice(res.data.c); // Set the market price (Finnhub format)
          setLimitPrice(res.data.c.toFixed(2)); // Default limit price to market price
          setLoadingPrice(false);
          setError(null);
        } catch (err) {
          setLoadingPrice(false);
          setError("Invalid ticker (US Stocks Only)"); // Update error
        }
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [ticker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- 4. BUILD THE ORDER REQUEST ---
    const orderData = {
      ticker: ticker.toUpperCase(),
      quantity: parseFloat(quantity),
      // Use live market price for MARKET, or user's limit price for LIMIT
      price: orderType === 'MARKET' ? parseFloat(price) : parseFloat(limitPrice),
      date: new Date().toISOString(),
      type: tradeType,
      orderType: orderType,
    };
    
    if (orderType === 'LIMIT' && (!orderData.price || orderData.price <= 0)) {
        setError("Please enter a valid limit price.");
        return;
    }

    try {
      // --- 5. USE THE placeOrder SERVICE ---
      await placeOrder(orderData);
      
      fetchWalletBalance(); // Refresh wallet
      onSuccess(); // Refresh dashboard
      onClose();   // Close modal
    } catch (err) {
      setError(err.response?.data || 'Failed to place order.');
      console.error(err);
    }
  };

  const currentPrice = (quantity && (orderType === 'MARKET' ? price : limitPrice)) 
    ? parseFloat(quantity) * parseFloat(orderType === 'MARKET' ? price : limitPrice) 
    : 0;

  // --- 6. THE JSX IS CORRECT ---
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BUY/SELL Toggle */}
        <div className="flex mb-4 border border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setTradeType('BUY')}
            className={`w-1/2 py-3 font-semibold ${tradeType === 'BUY' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            BUY
          </button>
          <button
            onClick={() => setTradeType('SELL')}
            className={`w-1/2 py-3 font-semibold ${tradeType === 'SELL' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            SELL
          </button>
        </div>
        
        {/* MARKET/LIMIT TOGGLE */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setOrderType('MARKET')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${orderType === 'MARKET' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Market Order
          </button>
          <button
            onClick={() => setOrderType('LIMIT')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${orderType === 'LIMIT' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Limit Order
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-center text-red-300 bg-red-800 bg-opacity-50 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Ticker Symbol</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="e.g., AAPL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Quantity</label>
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="e.g., 10"
              required
            />
          </div>
          
          {/* Conditional Price Fields */}
          {orderType === 'MARKET' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300">Market Price</label>
              <input
                type="text"
                value={loadingPrice ? "Fetching..." : (price ? `$${price}` : '')}
                className="w-full px-3 py-2 mt-1 text-gray-400 bg-gray-900 border border-gray-700 rounded-md"
                readOnly
              />
            </div>
          ) : (
             <div>
              <label className="block text-sm font-medium text-gray-300">Limit Price</label>
              <input
                type="number"
                step="any"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
                placeholder="Set your price"
                required
              />
            </div>
          )}

          <div className="text-gray-400 text-sm pt-2">
            Estimated {tradeType === 'BUY' ? 'Cost' : 'Proceeds'}:
            <span className="text-white font-bold text-base ml-2">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white font-semibold rounded-md ${tradeType === 'BUY' ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'}`}
            >
              Submit {tradeType} {orderType} Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TradeModal;