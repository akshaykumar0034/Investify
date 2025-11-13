//src/api/axiosConfig.js

import axios from 'axios';

// Get the base URL from the .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Runs before every request is sent
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional but good for handling 401s)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 (Unauthorized), log the user out
      localStorage.removeItem('accessToken');
      // window.location.href = '/login';
      console.error("Unauthorized request. User logged out.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;