import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Volume2 } from 'lucide-react';

const Settings = ({ isOpen, onClose }) => {
  const { theme, updateBackground, updateFont, updateAlarmSound } = useTheme();

  if (!isOpen) return null;

  const gradients = [
    { name: 'Midnight', class: 'bg-gradient-to-br from-gray-900 to-gray-800' },
    { name: 'Slate', class: 'bg-gradient-to-br from-slate-900 to-slate-700' },
    { name: 'Ocean', class: 'bg-gradient-to-br from-blue-900 to-cyan-900' },
    { name: 'Forest', class: 'bg-gradient-to-br from-green-900 to-emerald-900' },
    { name: 'Sunset', class: 'bg-gradient-to-br from-orange-900 to-red-900' },
    { name: 'Berry', class: 'bg-gradient-to-br from-purple-900 to-pink-900' },
  ];

  const fonts = [
    { name: 'Modern', class: 'font-sans' },
    { name: 'Code', class: 'font-mono' },
    { name: 'Classic', class: 'font-serif' },
  ];

  const sounds = [
    { name: 'Beep', value: 'beep' },
    { name: 'Zen Bell', value: 'bell' },
    { name: 'Digital', value: 'digital' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-700">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Background</h3>
          <div className="grid grid-cols-3 gap-3">
            {gradients.map((g) => (
              <button
                key={g.name}
                onClick={() => updateBackground(g.class)}
                className={`h-12 rounded-lg ${g.class} border-2 transition-all flex items-center justify-center text-xs font-medium shadow-sm ${
                  theme.background === g.class ? 'border-white scale-105' : 'border-transparent hover:border-gray-500'
                }`}
                title={g.name}
              >
                {/* Optional: Add text if gradients fail to render, though they should work */}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Typography</h3>
          <div className="flex flex-col space-y-2">
            {fonts.map((f) => (
              <button
                key={f.name}
                onClick={() => updateFont(f.class)}
                className={`px-4 py-3 rounded-lg text-left border transition-all flex justify-between items-center ${
                  theme.font === f.class 
                    ? 'bg-gray-700 border-blue-500 text-white' 
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700'
                } ${f.class}`}
              >
                <span>{f.name}</span>
                {theme.font === f.class && <span className="text-blue-400 text-sm">Active</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center gap-2">
            <Volume2 size={18} />
            Alarm Sound
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {sounds.map((s) => (
              <button
                key={s.value}
                onClick={() => updateAlarmSound(s.value)}
                className={`px-2 py-2 rounded-lg border transition-all text-sm font-medium ${
                  theme.alarmSound === s.value
                    ? 'bg-gray-700 border-blue-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
