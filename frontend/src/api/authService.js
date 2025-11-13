//src/api/authservice.js

import axiosInstance from './axiosConfig';

export const register = (name, email, password) => {
  return axiosInstance.post('/auth/register', {
    name,
    email,
    password,
  });
};

// Add this new login function
export const login = (email, password) => {
  return axiosInstance.post('/auth/login', {
    email,
    password,
  });
};