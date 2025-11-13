import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// App Pages (Private)
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import WatchlistPage from './pages/WatchlistPage';
import MarketPage from './pages/MarketPage';
import OrdersPage from './pages/OrdersPage';

// This component will handle the root redirect
function Root() {
  const { user } = useAuth();
  // If user is logged in, go to /home. If not, go to the public /landing page.
  return user ? <Navigate to="/home" replace /> : <Navigate to="/landing" replace />;
}

function App() {
  return (
    <Routes>
      {/* --- Public Routes (New Navbar + Footer) --- */}
      <Route element={<PublicLayout />}>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* --- Protected App Routes (Sidebar + Footer) --- */}
      <Route element={<MainLayout />}>
        {/* These pages are public-facing but use the app layout */}
        <Route path="/market" element={<MarketPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Route>
      </Route>
      
      {/* --- Root Redirect --- */}
      <Route path="/" element={<Root />} />
      
      {/* --- 404 Not Found --- */}
      <Route path="*" element={
        <div className="text-white text-center p-10">
          <h2>404 Not Found</h2>
          <Link to="/" className="text-green-400">Go Home</Link>
        </div>
      } />

    </Routes>
  );
}

export default App;