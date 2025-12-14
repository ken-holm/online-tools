import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 bg-gray-800 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">tools.holmcc.com</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/clock" className="text-lg text-blue-300 hover:text-blue-500 transition-colors">
                Clock
              </Link>
            </li>
            {/* Future tools will go here */}
          </ul>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Outlet />
      </main>
      <footer className="p-4 bg-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} tools.holmcc.com. All rights reserved.
        {/* Monetization button/link will go here */}
      </footer>
    </div>
  );
};

export default Layout;
