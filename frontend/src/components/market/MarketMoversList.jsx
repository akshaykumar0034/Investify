import React from 'react';

// Helper to format the percentage
const formatPercent = (changePercentString) => {
  try {
    // Alpha Vantage sends "0.91%" as a string
    const value = parseFloat(changePercentString.replace("%", ""));
    const isProfit = value >= 0;
    const color = isProfit ? 'text-green-500' : 'text-red-500';
    const sign = isProfit ? '+' : '';
    return (
      <span className={color}>
        {sign}{value.toFixed(2)}%
      </span>
    );
  } catch (e) {
    return <span className="text-gray-400">--</span>;
  }
};

// listType is "Gainers" or "Losers"
function MarketMoversList({ title, data, listType = "Gainers" }) {
  
  const headerColor = listType === "Gainers" ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className={`text-xl font-semibold mb-4 ${headerColor}`}>{title}</h3>
      <ul className="space-y-4">
        {data.slice(0, 5).map((stock) => ( // Show top 5
          <li key={stock.ticker} className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{stock.ticker}</p>
              {/* Alpha Vantage doesn't provide name in this endpoint, only ticker */}
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">${parseFloat(stock.price).toFixed(2)}</p>
              <p className="text-sm">{formatPercent(stock.change_percentage)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MarketMoversList;