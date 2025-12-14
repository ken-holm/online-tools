import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Menu, Coffee } from 'lucide-react';
import Settings from './Settings';

const Layout = () => {
  const { theme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hideMenuTimeoutRef = useRef(null);

  const showMenu = () => {
    if (hideMenuTimeoutRef.current) {
      clearTimeout(hideMenuTimeoutRef.current);
      hideMenuTimeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const hideMenu = () => {
    hideMenuTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 1500);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hideMenuTimeoutRef.current) clearTimeout(hideMenuTimeoutRef.current);
    };
  }, []);

  return (
    <div className={`min-h-screen text-white flex flex-col transition-all duration-500 relative ${theme.background} ${theme.font}`}>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight text-white/90 hover:text-white transition-colors z-50">
          <Link to="/">tools.holmcc.com</Link>
        </h1>

        {/* Hamburger Icon Area */}
        <div 
          className="relative z-50"
          onMouseEnter={showMenu}
          onMouseLeave={hideMenu}
        >
          <div className="p-2 cursor-pointer text-white/70 hover:text-white transition-colors">
            <Menu size={28} />
          </div>

          {/* Dropdown Menu */}
          <div 
            className={`absolute right-0 top-full mt-2 w-64 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top-right ${
              isMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
            }`}
          >
            <nav className="flex flex-col p-2 max-h-[80vh] overflow-y-auto">
              <Link to="/clock" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Clock</Link>
              <Link to="/countdown" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Countdown</Link>
              <Link to="/timer" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Timer</Link>
              <Link to="/pomodoro" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Pomodoro</Link>
              <Link to="/world-clock" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">World Clock</Link>
              <Link to="/metronome" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Metronome</Link>
              <Link to="/stopwatch" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Stopwatch</Link>
              <Link to="/calculator" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Calculator</Link>
              <Link to="/prompter" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Prompter</Link>
              <Link to="/message" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Message</Link>
              <Link to="/breathing" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Breathing</Link>
              <Link to="/counter" className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Counter</Link>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-left w-full"
              >
                <SettingsIcon size={16} />
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      <main className="flex-grow flex items-center justify-center p-6 relative z-0">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-white/40 text-xs relative z-0 flex flex-col items-center gap-4">
        <div>
          &copy; {new Date().getFullYear()} tools.holmcc.com
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://www.buymeacoffee.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-yellow-400/80 hover:text-yellow-300 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
          >
            <Coffee size={14} />
            <span>Buy me a coffee</span>
          </a>
          
          <a 
            href="https://www.bluehost.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300/60 hover:text-blue-300 transition-colors"
          >
            Hosted on BlueHost
          </a>
        </div>
      </footer>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Layout;
