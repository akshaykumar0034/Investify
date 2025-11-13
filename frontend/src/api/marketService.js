import axiosInstance from './axiosConfig';

export const getQuote = (ticker) => {
  return axiosInstance.get(`/market/quote/${ticker}`);
};

export const searchSymbols = (query) => {
  return axiosInstance.get(`/market/search/${query}`);
};
export const getCompanyNews = (ticker) => {
  return axiosInstance.get(`/market/news/${ticker}`);
};
export const getStockCandles = (ticker, resolution = 'D') => {
  const to = Math.floor(Date.now() / 1000);
  const from = to - (365 * 24 * 60 * 60);
  return axiosInstance.get(`/market/candles/${ticker}`, { params: { resolution, from, to } });
};

export const getMarketIndices = () => {
  return axiosInstance.get('/market/indices');
};

export const getMarketStatus = () => {
  return axiosInstance.get('/market/status');
};