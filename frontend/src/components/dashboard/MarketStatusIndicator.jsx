import React from 'react';

function MarketStatusIndicator({ status }) {
  if (!status) {
    return null; // Don't render if status hasn't loaded
  }

  const isOpen = status.isOpen;
  const bgColor = isOpen ? 'bg-green-500' : 'bg-red-500';
  const dotColor = isOpen ? 'bg-green-300' : 'bg-red-300';
  const text = isOpen ? 'Market is OPEN' : 'Market is CLOSED';

  return (
    <div className="flex items-center space-x-2">
      <span className={`relative flex h-3 w-3`}>
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
      </span>
      <span className="text-sm font-medium text-white">{text}</span>
    </div>
  );
}

export default MarketStatusIndicator;