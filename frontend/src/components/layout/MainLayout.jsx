import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';

function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      {/* --- 1. THIS IS THE MAIN CONTENT WRAPPER --- */}
      {/*
        - 'flex-1' makes it take the remaining width.
        - 'flex' and 'flex-col' stack the content and footer vertically.
        - 'overflow-y-auto' makes THIS whole column scroll.
      */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* --- 2. THE MAIN CONTENT AREA --- */}
        {/*
          - 'flex-grow' (or 'flex-1') ensures this <main> element expands
            to push the footer to the bottom, even on short pages.
        */}
        <main className="flex-grow">
          <Outlet />
        </main>

        {/* --- 3. THE FOOTER --- */}
        {/*
          - 'flex-shrink-0' ensures the footer never shrinks.
          - It is now at the bottom of the scrolling column.
        */}
        <Footer className="flex-shrink-0" />
      </div>
    </div>
  );
}

export default MainLayout;