import React, { useState } from 'react';
import { addTransaction } from '../api/portfolioService';
import { useAuth } from '../context/AuthContext'; // <-- Correctly imported

// 'onClose' and 'onSuccess' are functions passed down
function AddTransactionModal({ onClose, onSuccess }) {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);

  const { fetchWalletBalance } = useAuth(); // <-- Correctly getting the hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const transactionData = {
      ticker: ticker.toUpperCase(),
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date: new Date().toISOString(), 
      type: 'BUY',
    };

    try {
      await addTransaction(transactionData);
      fetchWalletBalance(); // <-- Correct: Refreshes wallet
      onSuccess(); // Tell the dashboard to refetch portfolio
      onClose();   // Close the modal
    } catch (err) {
      // --- This is the correct error handling ---
      setError(err.response?.data || 'Failed to add transaction.');
      console.error(err);
    }
  };

  return (
    // This is the modal backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} // Close modal if clicking outside
    >
      {/* This is the modal content */}
      <div 
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Stop click from bubbling to backdrop
      >
        <h2 className="text-2xl font-bold mb-6 text-green-400">Add Buy Transaction</h2>
        
        {error && (
          <div className="p-3 mb-4 text-center text-red-300 bg-red-800 bg-opacity-50 rounded-md">
            {error} {/* <-- This will now show "Insufficient funds." */}
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
          <div>
            <label className="block text-sm font-medium text-gray-300">Price per Share</label>
            <input
              type="number"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="e.g., 150.75"
              required
            />
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
              className="px-4 py-2 text-gray-900 bg-green-400 rounded-md hover:bg-green-300"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;