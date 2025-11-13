import axiosInstance from './axiosConfig';

// Replaces the old addBuy/Sell transaction calls
export const placeOrder = (orderData) => {
  // orderData will be { ticker, quantity, price, type, orderType, date }
  return axiosInstance.post('/orders/place', orderData);
};

export const getOrderHistory = () => {
  return axiosInstance.get('/orders/history');
};