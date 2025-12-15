import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Copy, RefreshCw, Check, Edit2 } from 'lucide-react';
import SEO from '../SEO';

const PasswordGenerator = () => {
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12); // Default to 12
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const [isEditingLength, setIsEditingLength] = useState(false);
  const [inputLength, setInputLength] = useState(length);
  const lengthInputRef = useRef(null);

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let chars = '';
    if (options.uppercase) chars += charset.uppercase;
    if (options.lowercase) chars += charset.lowercase;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;

    if (chars === '') {
      setPassword('');
      setStrength(0);
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += chars[array[i] % chars.length];
    }

    setPassword(generated);
    calculateStrength(generated);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setStrength(Math.min(5, score));
  };

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleOption = (key) => {
    setOptions(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Prevent unchecking all
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-gray-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-lime-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };

  const handleSaveLength = () => {
    let newLen = parseInt(inputLength);
    if (isNaN(newLen) || newLen < 8) newLen = 8;
    if (newLen > 64) newLen = 64;
    setLength(newLen);
    setInputLength(newLen); // Sync input with validated length
    setIsEditingLength(false);
  };

  useEffect(() => {
    if (isEditingLength && lengthInputRef.current) {
      lengthInputRef.current.focus();
      lengthInputRef.current.select();
    }
  }, [isEditingLength]);


  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font}`}>
      <SEO 
        title="Password Generator" 
        description="Generate strong, secure, random passwords instantly. Customize length and characters used."
        keywords="password generator, secure password, random password, strong password, security tool"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        Password Generator
      </h2>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        
        {/* Password Display */}
        <div className="relative mb-6">
          <div className="w-full bg-gray-900 p-4 rounded-xl text-white font-mono text-xl md:text-2xl break-all min-h-[4rem] flex items-center pr-12 border border-gray-600">
            {password}
          </div>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
          </button>
        </div>

        {/* Strength Bar */}
        <div className="flex gap-1 h-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-colors duration-300 ${i < strength ? getStrengthColor() : 'bg-gray-700'}`} 
            />
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Length Slider */}
          <div>
            <div className="flex justify-between text-white/80 mb-2 font-medium items-center">
              <span>Length</span>
              {isEditingLength ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={lengthInputRef}
                    type="number"
                    min="8"
                    max="64"
                    value={inputLength}
                    onChange={(e) => setInputLength(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveLength()}
                    onBlur={handleSaveLength}
                    className="w-16 p-1 rounded bg-gray-700 border border-gray-600 text-white text-center text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={handleSaveLength} className="text-green-400 hover:text-green-300">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <span onClick={() => setIsEditingLength(true)} className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                  {length} <Edit2 size={16} />
                </span>
              )}
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => {setLength(Number(e.target.value)); setInputLength(Number(e.target.value));}}
              className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Options Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  value 
                    ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                    : 'bg-gray-700/50 border-transparent text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className="capitalize font-medium">{key}</span>
                {value && <Check size={16} className="text-blue-400" />}
              </button>
            ))}
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <RefreshCw size={20} />
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
