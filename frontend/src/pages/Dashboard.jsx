import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// --- 1. IMPORT ALL SERVICES ---
import { getMyPortfolio, getPerformanceHistory } from '../api/portfolioService'; 
import { getQuote, getMarketStatus } from '../api/marketService'; // <-- Has getMarketStatus
import { getOrderHistory } from '../api/orderService'; // <-- Has getOrderHistory
import { downloadReport } from '../api/reportService';
// --- 2. IMPORT ALL COMPONENTS ---
import TradeModal from '../components/TradeModal.jsx';
import HoldingsList from '../components/dashboard/HoldingsList.jsx';
import PerformanceChart from '../components/dashboard/PerformanceChart.jsx';
import MarketStatusIndicator from '../components/dashboard/MarketStatusIndicator.jsx';
import RecentOrdersList from '../components/dashboard/RecentOrdersList.jsx';

// Helper function to calculate totals (Unchanged)
const calculateTotals = (holdings, marketData) => {
  let totalCurrentValue = 0;
  let totalInvested = 0;

  for (const holding of holdings) {
    const quote = marketData[holding.ticker];
    const currentPrice = (quote && typeof quote.c === 'number') 
      ? quote.c 
      : holding.avgBuyPrice;
    
    totalCurrentValue += currentPrice * holding.quantity;
    totalInvested += holding.avgBuyPrice * holding.quantity;
  }

  const totalPL = totalCurrentValue - totalInvested;
  return { totalCurrentValue, totalPL };
};

// Helper to format P/L (Unchanged)
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


function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  
  // --- 3. ADDED NEW STATE ---
  const [marketStatus, setMarketStatus] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      
      // --- 4. FETCH ALL DATA IN PARALLEL ---
      const [portfolioResponse, performanceResponse, statusResponse, ordersResponse] = await Promise.all([
        getMyPortfolio(),
        getPerformanceHistory(),
        getMarketStatus(),
        getOrderHistory()
      ]);
      
      const portfolioData = portfolioResponse.data;
      setPortfolio(portfolioData);
      setPerformanceData(performanceResponse.data);
      setMarketStatus(statusResponse.data); // <-- Set market status
      setRecentOrders(ordersResponse.data); // <-- Set recent orders

      if (portfolioData.holdings && portfolioData.holdings.length > 0) {
        // ... (existing quote fetching logic is unchanged) ...
        const quotePromises = portfolioData.holdings.map(holding => getQuote(holding.ticker));
        const quoteResponses = await Promise.all(quotePromises);
        const marketDataMap = {};
        quoteResponses.forEach((response, index) => {
          const ticker = portfolioData.holdings[index].ticker;
          marketDataMap[ticker] = response.data;
        });
        setMarketData(marketDataMap);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Could not load your portfolio.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleTransactionSuccess = () => {
    fetchPortfolio(); // This will now refetch *all* data
  };
  
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      await downloadReport();
    } catch (err) {
      console.error("Failed to download report", err);
    } finally {
      setIsDownloading(false);
    }
  };

  
  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-400">Loading your portfolio...</p>;
    }
    if (error) {
      return <p className="text-red-400">{error}</p>;
    }
    if (portfolio) {
      
      const { totalCurrentValue, totalPL } = calculateTotals(portfolio.holdings, marketData);

      return (
        // --- 5. NEW 2-COLUMN LAYOUT ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- MAIN COLUMN (LEFT) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <PerformanceChart data={performanceData} />
            </div>

            {/* Holdings List */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">My Holdings</h3>
              <HoldingsList holdings={portfolio.holdings} marketData={marketData} />
            </div>
          </div>

          {/* --- SIDEBAR COLUMN (RIGHT) --- */}
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
              <h3 className="text-xl font-semibold">{portfolio.name}</h3>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Current Value</h4>
                <p className="text-3xl font-bold mt-1">
                  ${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Total P/L</h4>
                <p className="text-3xl font-bold mt-1">
                  {formatPL(totalPL)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Total Invested</h4>
                <p className="text-3xl font-bold mt-1">
                  ${portfolio.totalInvested.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <RecentOrdersList orders={recentOrders} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <> 
      <div className="p-8 text-white">
        {/* --- 6. NEW HEADER WITH STATUS --- */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-400">My Dashboard</h1>
          <div className="flex space-x-4 items-center">
            <MarketStatusIndicator status={marketStatus} />
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 disabled:bg-gray-500"
            >
              {isDownloading ? 'Downloading...' : 'Download Report'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-gray-900 bg-green-400 rounded-md hover:bg-green-300"
            >
              + Add Transaction
            </button>
          </div>
        </div>
        
        {renderContent()}
      </div>
      
      {/* Modal (Unchanged) */}
      {isModalOpen && (
        <TradeModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </>
  );
}

export default Dashboard;