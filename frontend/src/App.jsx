import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import WatchlistPage from './pages/WatchlistPage';
import MarketPage from './pages/MarketPage';
import OrdersPage from './pages/OrdersPage';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage'; // <-- 1. IMPORT NEW HOMEPAGE

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* --- Protected Routes (and the new public HomePage) --- */}
      {/* Wrap all main app pages in the layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} /> {/* <-- 2. SET HOMEPAGE AS ROOT */}
        
        {/* These routes require a user to be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Route>
        
        {/* This page is public but uses the layout */}
        <Route path="/market" element={<MarketPage />} /> 
      </Route>
      
    </Routes>
  );
}

export default App;