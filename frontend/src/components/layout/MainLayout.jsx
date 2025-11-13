//src/components/layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* The <Outlet> renders the active child route (e.g., Dashboard, Watchlist) */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;