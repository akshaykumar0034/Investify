//src/api/portfolioService.js

import axiosInstance from './axiosConfig';

export const getMyPortfolio = () => {
  return axiosInstance.get('/portfolio');
};

export const addBuyTransaction = (transactionData) => { 
  return axiosInstance.post('/transactions/buy', transactionData);
};

export const addSellTransaction = (transactionData) => {
  return axiosInstance.post('/transactions/sell', transactionData);
};

export const getPerformanceHistory = () => {
  return axiosInstance.get('/portfolio/performance');
};