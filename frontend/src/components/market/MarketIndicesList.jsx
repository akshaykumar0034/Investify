import React from 'react';

// Helper to format the percentage
const formatPercent = (change) => {
  const isProfit = change >= 0;
  const color = isProfit ? 'text-green-500' : 'text-red-500';
  const sign = isProfit ? '+' : '';
  return (
    <span className={color}>
      {sign}{change.toFixed(2)}%
    </span>
  );
};

function MarketIndicesList({ title, data }) {
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <ul className="space-y-4">
        {data.map((index) => (
          <li key={index.symbol} className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{index.name}</p>
              <p className="text-sm text-gray-400">{index.symbol}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">
                {/* Format for INR */}
                ₹{index.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm">{formatPercent(index.changesPercentage)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MarketIndicesList;