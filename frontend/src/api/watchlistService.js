//src/api/watchlistService.js

import axiosInstance from './axiosConfig';

// Get the user's watchlist
export const getWatchlist = () => {
  return axiosInstance.get('/watchlist');
};

// Add a ticker to the watchlist
export const addToWatchlist = (ticker) => {
  return axiosInstance.post('/watchlist/add', { ticker });
};

// Remove a ticker from the watchlist
export const removeFromWatchlist = (ticker) => {
  return axiosInstance.delete(`/watchlist/remove/${ticker}`);
};