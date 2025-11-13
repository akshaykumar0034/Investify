import React, { useState, useEffect } from 'react';
import { 
  getQuote, 
  searchSymbols, 
  getCompanyNews, 
  getStockCandles,
  getTopGainers, 
  getTopLosers  
} from '../api/marketService';
import { addToWatchlist } from '../api/watchlistService';
import { FaSearch } from 'react-icons/fa';
import StockChart from '../components/StockChart';
import MarketMoversList from '../components/market/MarketMoversList';

const formatCandleData = (finnhubData) => {
  if (!finnhubData || finnhubData.s !== 'ok') {
    return [];
  }
  return finnhubData.t.map((timestamp, index) => ({
    time: timestamp,
    open: finnhubData.o[index],
    high: finnhubData.h[index],
    low: finnhubData.l[index],
    close: finnhubData.c[index],
  }));
};

const formatPrice = (price) => {
    if (typeof price !== 'number') return '$0.00';
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatChange = (change, changePercent) => {
    if (typeof change !== 'number' || typeof changePercent !== 'number') return '';
    const isProfit = change >= 0;
    const color = isProfit ? 'text-green-400' : 'text-red-400';
    const sign = isProfit ? '+' : '';
    return (
      <span className={color}>
        {sign}{formatPrice(change)} ({sign}{formatPrice(changePercent)}%)
      </span>
    );
};


function MarketPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quote, setQuote] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loadingMovers, setLoadingMovers] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        setLoadingMovers(true);
        const [gainersRes, losersRes] = await Promise.all([
          getTopGainers(),
          getTopLosers()
        ]);
        setGainers(gainersRes.data);
        setLosers(losersRes.data);
      } catch (err) {
        console.error("Failed to fetch market movers:", err);
      } finally {
        setLoadingMovers(false);
      }
    };
    fetchMovers();
  }, []); 


  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 1) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    setQuote(null);
    setNews([]);
    setChartData([]); 
    try {
      const res = await searchSymbols(query);
      setResults(res.data.result);
    } catch (err) {
      setError('Failed to search symbols.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSymbol = async (symbol) => {
    setLoading(true);
    setError(null);
    setSelected(symbol);
    setResults([]); 
    try {
      const [quoteRes, newsRes, candleRes] = await Promise.all([
        getQuote(symbol),
        getCompanyNews(symbol),
        getStockCandles(symbol, 'D') 
      ]);
      setQuote(quoteRes.data);
      setNews(newsRes.data.slice(0, 5)); 
      setChartData(formatCandleData(candleRes.data)); 
    } catch (err) {
      setError('Failed to fetch stock details.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToWatchlist = async (ticker) => {
    try {
      await addToWatchlist(ticker);
      alert('Added to watchlist!');
    } catch (err) {
      setError(err.response?.data || 'Failed to add to watchlist.');
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Market</h1>
      
      {/* --- MARKET MOVERS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {loadingMovers ? (
          <p>Loading market movers...</p>
        ) : (
          <>
            <MarketMoversList title="Top Gainers" data={gainers} listType="Gainers" />
            <MarketMoversList title="Top Losers" data={losers} listType="Losers" />
          </>
        )}
      </div>
      {/* --- END OF MOVERS SECTION --- */}

      {/* --- SEARCH BAR --- */}
      <form onSubmit={handleSearch} className="flex w-full max-w-lg mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-3 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-l-md"
          placeholder="Search for a symbol (e.g., AAPL, MSFT...)"
        />
        <button
          type="submit"
          className="px-4 py-2 text-gray-900 bg-green-400 rounded-r-md hover:bg-green-300"
        >
          <FaSearch />
        </button>
      </form>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* --- RESULTS SECTION --- */}
      <div className="w-full max-w-4xl">
        {loading && <p>Loading...</p>}

        {/* Search Results List */}
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-lg">
            {results.map((item) => (
              <div
                key={item.symbol}
                onClick={() => handleSelectSymbol(item.symbol)}
                className="flex justify-between items-center p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
              >
                <div>
                  <div className="font-bold">{item.symbol}</div>
                  <div className="text-sm text-gray-400">{item.description}</div>
                </div>
                <div className="text-sm text-gray-400">{item.type}</div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Stock Details */}
        {selected && quote && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{selected}</h2>
              <button
                onClick={() => handleAddToWatchlist(selected)}
                className="px-4 py-2 text-sm font-semibold text-gray-900 bg-blue-500 rounded-md hover:bg-blue-400"
              >
                + Add to Watchlist
              </button>
            </div>
            
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg mb-8">
              <div className="text-4xl font-bold">${formatPrice(quote.c)}</div>
              <div className="text-lg">{formatChange(quote.d, quote.dp)}</div>
            </div>

            {/* RENDER THE CHART */}
            <div className="bg-gray-800 rounded-lg shadow-lg mb-8">
              {chartData.length > 0 ? (
                <StockChart data={chartData} />
              ) : (
                <p className="p-8 text-center text-gray-400">No chart data available.</p>
              )}
            </div>
            {/* END OF CHART */}

            <h3 className="text-2xl font-semibold mb-4">Recent News</h3>
            <div className="space-y-4">
              {news.map((article) => (
                <a 
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700"
                >
                  <div className="font-semibold">{article.headline}</div>
                  <div className="text-sm text-gray-400 mt-1">{article.source} - {new Date(article.datetime * 1000).toLocaleDateString()}</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketPage;