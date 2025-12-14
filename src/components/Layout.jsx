import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';

const Layout = () => {
  const { theme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className={`min-h-screen text-white flex flex-col transition-all duration-500 relative ${theme.background} ${theme.font}`}>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight text-white/90 hover:text-white transition-colors">
          <Link to="/">tools.holmcc.com</Link>
        </h1>
        <nav className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link to="/clock" className="text-white/70 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                Clock
              </Link>
            </li>
            <li>
              <Link to="/countdown" className="text-white/70 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                Countdown
              </Link>
            </li>
            {/* Future tools will go here */}
          </ul>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      <main className="flex-grow flex items-center justify-center p-6 relative z-0">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-white/30 text-xs relative z-0">
        &copy; {new Date().getFullYear()} tools.holmcc.com
      </footer>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Layout;
