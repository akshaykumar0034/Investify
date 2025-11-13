import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// App Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import WatchlistPage from './pages/WatchlistPage';
import MarketPage from './pages/MarketPage';
import OrdersPage from './pages/OrdersPage';

// This component will handle the root redirect
function Root() {
  const { user } = useAuth();
  // If user is logged in, go to /home. If not, go to the landing page.
  return user ? <Navigate to="/home" /> : <Navigate to="/landing" />;
}

function App() {
  return (
    <Routes>
      {/* --- Public Routes (with new Navbar/Footer) --- */}
      <Route element={<PublicLayout />}>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* --- Protected App Routes (with Sidebar/Footer) --- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/market" element={<MarketPage />} />
        </Route>
      </Route>
      
      {/* --- Root Redirect --- */}
      <Route path="/" element={<Root />} />
      
      {/* --- 404 Not Found (Optional but recommended) --- */}
      <Route path="*" element={<div><h2>404 Not Found</h2></div>} />

    </Routes>
  );
}

export default App;