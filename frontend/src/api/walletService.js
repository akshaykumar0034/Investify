import axiosInstance from './axiosConfig';

export const getWalletBalance = () => {
  return axiosInstance.get('/wallet/balance');
};

export const addFunds = (amount) => {
  return axiosInstance.post('/wallet/add', { amount });
};