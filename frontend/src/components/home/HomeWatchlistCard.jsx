import React from 'react';
import { Link } from 'react-router-dom';

function HomeWatchlistCard({ watchlist }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">My Watchlist</h3>
        <Link to="/watchlist" className="text-sm text-green-400 hover:text-green-300">
          View All
        </Link>
      </div>
      <ul className="space-y-3">
        {watchlist.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Your watchlist is empty.</p>
        ) : (
          watchlist.slice(0, 5).map((item) => ( // Show top 5
            <li key={item.id} className="flex justify-between items-center">
              <p className="font-bold text-white">{item.ticker}</p>
              {/* We'd need to fetch live prices to show more, but this is a good preview */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default HomeWatchlistCard;