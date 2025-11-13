import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authService';
import { getWalletBalance } from '../api/walletService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub });
        fetchWalletBalance(); // Fetch balance on initial load
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await getWalletBalance();
      setWalletBalance(res.data.balance);
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    }
  };

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('accessToken', res.data.accessToken);
    const decoded = jwtDecode(res.data.accessToken);
    setUser({ email: decoded.sub });
    await fetchWalletBalance(); // Fetch balance on login
  };

  const register = async (name, email, password) => {
    await apiRegister(name, email, password);
    // After registering, log them in
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setWalletBalance(0);
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, walletBalance, fetchWalletBalance }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};