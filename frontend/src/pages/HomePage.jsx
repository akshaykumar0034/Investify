import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyPortfolio } from '../api/portfolioService';
import { getWatchlist } from '../api/watchlistService';
import { getMarketStatus, getTopGainers, getTopLosers, getCompanyNews, getQuote } from '../api/marketService';
import { getOrderHistory } from '../api/orderService';

// Import all our new components
import HeroSection from '../components/home/HeroSection';
import HomePortfolioCard from '../components/home/HomePortfolioCard';
import HomeWatchlistCard from '../components/home/HomeWatchlistCard';
import MarketStatusIndicator from '../components/dashboard/MarketStatusIndicator';
import MarketMoversList from '../components/market/MarketMoversList';
import RecentOrdersList from '../components/dashboard/RecentOrdersList';

function HomePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [marketStatus, setMarketStatus] = useState(null);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  
  // Logged-in-only data
  const [portfolio, setPortfolio] = useState(null);
  const [marketData, setMarketData] = useState({}); // For portfolio value
  const [watchlist, setWatchlist] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [statusRes, gainersRes, losersRes] = await Promise.all([
          getMarketStatus(),
          getTopGainers(),
          getTopLosers(),
        ]);
        setMarketStatus(statusRes.data);
        setGainers(gainersRes.data);
        setLosers(losersRes.data);
      } catch (err) {
        console.error("Error fetching public market data:", err);
      }
    };

    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const [portfolioRes, watchlistRes, ordersRes] = await Promise.all([
          getMyPortfolio(),
          getWatchlist(),
          getOrderHistory(),
        ]);
        
        setPortfolio(portfolioRes.data);
        setWatchlist(watchlistRes.data);
        setRecentOrders(ordersRes.data);

        // Fetch market data for portfolio holdings
        if (portfolioRes.data.holdings && portfolioRes.data.holdings.length > 0) {
          const quotePromises = portfolioRes.data.holdings.map(h => getQuote(h.ticker));
          const quoteResponses = await Promise.all(quotePromises);
          const marketDataMap = {};
          quoteResponses.forEach((response, index) => {
            const ticker = portfolioRes.data.holdings[index].ticker;
            marketDataMap[ticker] = response.data;
          });
          setMarketData(marketDataMap);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const loadAllData = async () => {
      setLoading(true);
      await fetchPublicData();
      await fetchUserData();
      setLoading(false);
    };
    
    loadAllData();
  }, [user]); // Re-fetch all data when user logs in or out

  return (
    <div className="p-8 text-white">
      {/* --- Top Header Row --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-400">Home</h1>
        <MarketStatusIndicator status={marketStatus} />
      </div>

      {/* --- Hero or Portfolio/Watchlist --- */}
      <div className="mb-8">
        {loading ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center text-gray-400">Loading...</div>
        ) : user ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HomePortfolioCard portfolio={portfolio} marketData={marketData} />
            </div>
            <div>
              <HomeWatchlistCard watchlist={watchlist} />
            </div>
          </div>
        ) : (
          <HeroSection />
        )}
      </div>
      
      {/* --- Market Movers --- */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MarketMoversList title="Top Gainers" data={gainers} listType="Gainers" />
          <MarketMoversList title="Top Losers" data={losers} listType="Losers" />
        </div>
      </div>
      
      {/* --- Recent Orders (Logged-in only) --- */}
      {user && (
        <div className="mb-8">
          <RecentOrdersList orders={recentOrders} />
        </div>
      )}

      {/* TODO: Add News Feed here */}
      
    </div>
  );
}

export default HomePage;