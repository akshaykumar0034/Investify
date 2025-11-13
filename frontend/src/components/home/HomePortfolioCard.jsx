import React from 'react';
import { Link } from 'react-router-dom';

// Helper to format P/L
const formatPL = (pl) => {
  const isProfit = pl >= 0;
  const color = isProfit ? 'text-green-400' : 'text-red-400';
  const sign = isProfit ? '+' : '';
  return (
    <span className={color}>
      {sign}${pl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

function HomePortfolioCard({ portfolio, marketData }) {
  // Recalculate totals (same logic as dashboard)
  let totalCurrentValue = 0;
  if (portfolio.holdings) {
    for (const holding of portfolio.holdings) {
      const quote = marketData[holding.ticker];
      const currentPrice = (quote && typeof quote.c === 'number') ? quote.c : holding.avgBuyPrice;
      totalCurrentValue += currentPrice * holding.quantity;
    }
  }
  const totalPL = totalCurrentValue - portfolio.totalInvested;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">{portfolio.name}</h3>
      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-400">Current Value</h4>
          <p className="text-2xl font-bold text-white mt-1">
            ${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400">Total P/L</h4>
          <p className="text-2xl font-bold mt-1">
            {formatPL(totalPL)}
          </p>
        </div>
      </div>
      <Link 
        to="/dashboard"
        className="block w-full text-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400"
      >
        View Full Portfolio
      </Link>
    </div>
  );
}

export default HomePortfolioCard;