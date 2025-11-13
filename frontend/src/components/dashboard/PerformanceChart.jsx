import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Formatter for the Y-Axis (e.g., $10k)
const valueFormatter = (value) => {
  if (value > 1000) {
    return `$${(value / 1000).toLocaleString()}k`;
  }
  return `$${value.toLocaleString()}`;
};

// Formatter for the tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-gray-700 text-white rounded shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-green-400">
          Total Invested: ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

function PerformanceChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Make another transaction to see your performance history.
      </div>
    );
  }

  return (
    // ResponsiveContainer makes the chart fill its parent div
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af" 
          tick={{ fontSize: 12 }} 
        />
        <YAxis 
          stroke="#9ca3af" 
          tick={{ fontSize: 12 }} 
          tickFormatter={valueFormatter} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#22c55e" 
          strokeWidth={2} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PerformanceChart;