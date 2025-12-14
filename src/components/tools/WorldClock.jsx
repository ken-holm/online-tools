import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, X, Globe, Edit2, Check } from 'lucide-react';
import SEO from '../SEO';

const COMMON_TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Honolulu', value: 'Pacific/Honolulu' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'Denver', value: 'America/Denver' },
  { label: 'Chicago', value: 'America/Chicago' },
  { label: 'New York', value: 'America/New_York' },
  { label: 'São Paulo', value: 'America/Sao_Paulo' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Paris', value: 'Europe/Paris' },
  { label: 'Berlin', value: 'Europe/Berlin' },
  { label: 'Moscow', value: 'Europe/Moscow' },
  { label: 'Dubai', value: 'Asia/Dubai' },
  { label: 'Mumbai', value: 'Asia/Kolkata' },
  { label: 'Bangkok', value: 'Asia/Bangkok' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Sydney', value: 'Australia/Sydney' },
  { label: 'Auckland', value: 'Australia/Auckland' },
];

const WorldClock = () => {
  const { theme } = useTheme();
  const [time, setTime] = useState(new Date());
  
  // Detect local timezone
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem('worldClocks');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: Local Time + UTC
    return [
      { label: 'My Local Time', value: localTimeZone, isLocal: true },
      { label: 'UTC', value: 'UTC' }
    ];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null); // value of the clock being edited
  const [editLabel, setEditLabel] = useState('');
  const editInputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }, [clocks]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const addClock = (zone) => {
    if (!clocks.find(c => c.value === zone.value)) {
      setClocks([...clocks, { ...zone, label: zone.label }]); // Ensure we store a copy so we can edit label
    }
    setIsAdding(false);
  };

  const removeClock = (value) => {
    setClocks(clocks.filter(c => c.value !== value));
  };

  const startEditing = (clock) => {
    setEditingId(clock.value);
    setEditLabel(clock.label);
  };

  const saveLabel = (value) => {
    setClocks(clocks.map(c => c.value === value ? { ...c, label: editLabel } : c));
    setEditingId(null);
  };

  const getTimeString = (zoneValue) => {
    try {
      return time.toLocaleTimeString('en-US', {
        timeZone: zoneValue,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return 'Invalid Timezone';
    }
  };

  const getDateString = (zoneValue) => {
    try {
      return time.toLocaleDateString('en-US', {
        timeZone: zoneValue,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-8 w-full max-w-6xl mx-auto ${theme.font}`}>
      <SEO 
        title="World Clock" 
        description="Track current local time across multiple timezones. Customize labels and add your favorite cities."
        keywords="world clock, timezone converter, international time, online clock, local time"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md flex items-center gap-3">
        <Globe size={40} className="text-blue-400" />
        World Clock
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {clocks.map((clock) => (
          <div key={clock.value} className={`bg-gray-800/50 backdrop-blur-md border ${clock.isLocal ? 'border-blue-500/50 shadow-blue-500/20 shadow-lg' : 'border-white/10'} p-6 rounded-2xl relative group hover:bg-gray-800/70 transition-all duration-300`}>
            
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEditing(clock)}
                className="text-white/40 hover:text-white transition-colors"
                title="Edit Label"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => removeClock(clock.value)}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Remove Clock"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              {editingId === clock.value ? (
                <div className="flex items-center space-x-2 mb-1 w-full max-w-[200px]">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveLabel(clock.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-center w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={() => saveLabel(clock.value)} className="text-green-400 hover:text-green-300">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <span className={`text-lg font-medium tracking-wide uppercase mb-1 flex items-center gap-2 ${clock.isLocal ? 'text-blue-300' : 'text-blue-200/70'}`}>
                  {clock.label}
                  {clock.isLocal && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/30">YOU</span>}
                </span>
              )}
              
              <span className="text-5xl font-bold text-white tabular-nums tracking-tight drop-shadow-sm mb-2">
                {getTimeString(clock.value)}
              </span>
              <span className="text-white/50 text-sm font-medium">
                {getDateString(clock.value)}
              </span>
            </div>
          </div>
        ))}

        {/* Add Button Card */}
        <div className="flex items-center justify-center min-h-[200px]">
          {isAdding ? (
            <div className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-600 w-full animate-fade-in max-h-[300px] overflow-y-auto">
              <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-800 pb-2 border-b border-gray-700">
                <span className="text-white font-medium">Select Timezone</span>
                <button onClick={() => setIsAdding(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <ul className="space-y-1">
                {COMMON_TIMEZONES.filter(tz => !clocks.find(c => c.value === tz.value)).map(tz => (
                  <li key={tz.value}>
                    <button
                      onClick={() => addClock(tz)}
                      className="w-full text-left px-3 py-2 text-white/80 hover:bg-blue-600 hover:text-white rounded-md text-sm transition-colors"
                    >
                      {tz.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full h-full min-h-[180px] rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-white/5 flex flex-col items-center justify-center text-white/30 hover:text-white transition-all duration-300 group"
            >
              <Plus size={48} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add Clock</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldClock;
