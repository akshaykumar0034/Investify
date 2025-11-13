import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900"> {/* Dark theme */}
      <PublicNavbar />
      <main className="flex-grow">
        {/* <Outlet> renders the active child route (LandingPage, Login, etc.) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;