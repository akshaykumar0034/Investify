//src/components/dashboard/HoldingList.jsx
import React from 'react';

function HoldingsList({ holdings, marketData }) {
  // We don't need the console.log anymore
  // console.log("HoldingsList: Received marketData prop:", marketData);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        You have no holdings. Add a transaction to get started!
      </div>
    );
  }

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-4">Ticker</th>
            <th className="text-right p-4">Quantity</th>
            <th className="text-right p-4">Avg. Buy Price</th>
            <th className="text-right p-4">Current Price</th>
            <th className="text-right p-4">Current Value</th>
            <th className="text-right p-4">Total P/L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            
            const quote = marketData[holding.ticker];

            // --- THIS IS THE FIX ---
            // We are now checking for 'quote.c' (the key from the console log)
            const currentPrice = (quote && typeof quote.c === 'number') 
              ? quote.c 
              : holding.avgBuyPrice;
            // --- END OF FIX ---
            
            const currentValue = currentPrice * holding.quantity;
            const totalCost = holding.avgBuyPrice * holding.quantity;
            const totalPL = currentValue - totalCost;

            return (
              <tr key={holding.id} className="border-b border-gray-800 hover:bg-gray-700">
                <td className="p-4 font-bold">{holding.ticker}</td>
                <td className="text-right p-4">{holding.quantity.toLocaleString()}</td>
                <td className="text-right p-4">${holding.avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                
                {/* This will now show the real price */}
                <td className="text-right p-4">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="text-right p-4 font-bold">${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="text-right p-4">{formatPL(totalPL)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HoldingsList;