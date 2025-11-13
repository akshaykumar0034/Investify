import React, { useState } from 'react';
import { addFunds } from '../api/walletService'; // Use the new service

// 'onClose' and 'onSuccess' are passed from Sidebar
function AddFundsModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const numericAmount = parseFloat(amount);

    if (numericAmount <= 0) {
      setError("Please enter a positive amount.");
      return;
    }

    try {
      // res.data will be { "newBalance": 11000 }
      const res = await addFunds(numericAmount);
      onSuccess(res.data.newBalance); // Pass the new balance back
      onClose();   // Close the modal
    } catch (err) {
      setError('Failed to add funds. Please try again.');
      console.error(err);
    }
  };

  return (
    // Modal backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} 
    >
      {/* Modal content */}
      <div 
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold mb-6 text-green-400">Add Funds to Wallet</h2>
        
        {error && (
          <div className="p-3 mb-4 text-center text-red-300 bg-red-800 bg-opacity-50 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Amount</label>
            <input
              type="number"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="e.g., 1000"
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
              Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFundsModal;