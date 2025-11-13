//src/pages/WatchlistPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../api/watchlistService';
import { getQuote } from '../api/marketService'; // We reuse our market service!

function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [newTicker, setNewTicker] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch the watchlist
      const watchlistRes = await getWatchlist();
      const watchlistData = watchlistRes.data;
      setWatchlist(watchlistData);

      // 2. Fetch quotes for all items on the watchlist
      if (watchlistData.length > 0) {
        const quotePromises = watchlistData.map(item => getQuote(item.ticker));
        const quoteResponses = await Promise.all(quotePromises);

        const marketDataMap = {};
        quoteResponses.forEach((response, index) => {
          const ticker = watchlistData[index].ticker;
          marketDataMap[ticker] = response.data;
        });
        setMarketData(marketDataMap);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Could not load watchlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTicker) return;
    try {
      await addToWatchlist(newTicker.toUpperCase());
      setNewTicker('');
      fetchData(); // Refresh all data
    } catch (err) {
      console.error("Failed to add ticker:", err);
      setError(err.response?.data || "Failed to add ticker.");
    }
  };

  const handleRemoveTicker = async (ticker) => {
    try {
      await removeFromWatchlist(ticker);
      fetchData(); // Refresh all data
    } catch (err) {
      console.error("Failed to remove ticker:", err);
      setError("Failed to remove ticker.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-8">My Watchlist</h1>

      {/* Add Ticker Form */}
      <form onSubmit={handleAddTicker} className="w-full max-w-lg mb-8 flex space-x-2">
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          className="flex-grow px-3 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
          placeholder="Enter ticker (e.g., MSFT)"
        />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-gray-900 bg-green-400 rounded-md hover:bg-green-300"
        >
          Add
        </button>
      </form>

      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {/* Watchlist Table */}
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 p-8">Loading watchlist...</p>
        ) : (
          <table className="min-w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Ticker</th>
                <th className="text-right p-4">Current Price</th>
                <th className="text-right p-4">Day's Change</th>
                <th className="text-right p-4">Remove</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => {
                const quote = marketData[item.ticker];
                const price = (quote && quote.c) ? quote.c : 0;
                const change = (quote && quote.d) ? quote.d : 0;
                const changeColor = change >= 0 ? 'text-green-400' : 'text-red-400';

                return (
                  <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-4 font-bold">{item.ticker}</td>
                    <td className="text-right p-4">${price.toLocaleString()}</td>
                    <td className={`text-right p-4 ${changeColor}`}>{change.toLocaleString()}</td>
                    <td className="text-right p-4">
                      <button
                        onClick={() => handleRemoveTicker(item.ticker)}
                        className="px-2 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-500"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      <Link 
        to="/dashboard" 
        className="mt-8 text-green-400 hover:text-green-300"
      >
        &larr; Back to Dashboard
      </Link>
    </div>
  );
}

export default WatchlistPage;