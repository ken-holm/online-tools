import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Menu, Coffee, Download } from 'lucide-react';
import Settings from './Settings';

const Layout = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const hideMenuTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

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

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Menu with '/'
      if (e.key === '/' && !isSettingsOpen) {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
        return;
      }

      // Close menu with Escape
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        return;
      }

      if (!isMenuOpen) return;

      // Menu Navigation Logic
      const links = menuRef.current?.querySelectorAll('a');
      if (!links) return;

      // Handle simple letter keys
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        const char = e.key.toLowerCase();
        let matchIndex = -1;
        
        // Find next match
        const focusedElement = document.activeElement;
        let startIndex = 0;
        
        // If currently focused on a link, start searching after it
        Array.from(links).forEach((link, index) => {
          if (link === focusedElement) startIndex = index + 1;
        });

        // Search forward from current position
        for (let i = startIndex; i < links.length + startIndex; i++) {
          const index = i % links.length;
          if (links[index].textContent.toLowerCase().startsWith(char)) {
            matchIndex = index;
            break;
          }
        }

        if (matchIndex !== -1) {
          links[matchIndex].focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isSettingsOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Menu with '/'
      if (e.key === '/' && !isSettingsOpen) {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
        return;
      }

      // Close menu with Escape
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        return;
      }

      if (!isMenuOpen) return;

      // Menu Navigation Logic
      const links = menuRef.current?.querySelectorAll('a');
      if (!links) return;

      // Handle simple letter keys
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        const char = e.key.toLowerCase();
        let matchIndex = -1;
        
        // Find next match
        const focusedElement = document.activeElement;
        let startIndex = 0;
        
        // If currently focused on a link, start searching after it
        Array.from(links).forEach((link, index) => {
          if (link === focusedElement) startIndex = index + 1;
        });

        // Search forward from current position
        for (let i = startIndex; i < links.length + startIndex; i++) {
          const index = i % links.length;
          if (links[index].textContent.toLowerCase().startsWith(char)) {
            matchIndex = index;
            break;
          }
        }

        if (matchIndex !== -1) {
          links[matchIndex].focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isSettingsOpen]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hideMenuTimeoutRef.current) clearTimeout(hideMenuTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Fixed Background Layer */}
      <div className={`fixed inset-0 -z-50 transition-all duration-500 ${theme.background}`} />

      {/* Main Content Wrapper */}
      <div className={`min-h-screen text-white flex flex-col relative ${theme.font}`}>
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
          <div className="p-2 cursor-pointer text-white/70 hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={28} />
          </div>

          {/* Dropdown Menu */}
          <div 
            ref={menuRef}
            className={`absolute right-0 top-full mt-2 w-64 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top-right ${
              isMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
            }`}
          >
            <nav className="flex flex-col p-2 max-h-[80vh] overflow-y-auto">
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="px-4 py-3 hover:bg-blue-600/20 text-blue-300 hover:text-blue-200 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 w-full text-left mb-2 border border-blue-500/30"
                >
                  <Download size={16} />
                  Install App
                </button>
              )}
              <Link to="/bandwidth-calculator" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Bandwidth Calculator</Link>
              <Link to="/base64-encoder-decoder" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Base64 Encoder/Decoder</Link>
              <Link to="/breathing" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Breathing</Link>
              <Link to="/calculator" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Calculator</Link>
              <Link to="/clock" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Clock</Link>
              <Link to="/countdown" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Countdown</Link>
              <Link to="/counter" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Counter</Link>
              <Link to="/ip-subnet-calculator" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">IP Subnet Calculator</Link>
              <Link to="/ip-validator" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">IPv4/IPv6 Validator</Link>
              <Link to="/json-formatter" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">JSON Formatter</Link>
              <Link to="/jwt-debugger" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">JWT Debugger</Link>
              <Link to="/markdown-viewer" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Markdown Viewer</Link>
              <Link to="/message" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Message</Link>
              <Link to="/metronome" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Metronome</Link>
              <Link to="/password-generator" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Password Generator</Link>
              <Link to="/pomodoro" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Pomodoro</Link>
              <Link to="/prompter" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Prompter</Link>
              <Link to="/qr-code" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">QR Code</Link>
              <Link to="/stopwatch" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Stopwatch</Link>
              <Link to="/text-utilities" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Text Utilities</Link>
              <Link to="/timer" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Timer</Link>
              <Link to="/unit-converter" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">Unit Converter</Link>
              <Link to="/url-encoder-decoder" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">URL Encoder/Decoder</Link>
              <Link to="/world-clock" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors focus:bg-white/20 outline-none">World Clock</Link>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-left w-full focus:bg-white/20 outline-none"
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

      <footer className="py-8 text-center text-white/40 text-xs relative z-0 flex flex-col items-center gap-4 bg-black/20 backdrop-blur-md border-t border-white/10 mt-auto">
        <div>
          &copy; {new Date().getFullYear()} tools.holmcc.com
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href={import.meta.env.VITE_BUY_ME_A_COFFEE_URL || "https://www.buymeacoffee.com"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-yellow-400/80 hover:text-yellow-300 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
          >
            <Coffee size={14} />
            <span>Buy me a coffee</span>
          </a>
          
          <a 
            href={import.meta.env.VITE_BLUEHOST_AFFILIATE_URL || "https://www.bluehost.com"} 
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
    </>
  );
};

export default Layout;
