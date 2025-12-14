import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Minus, Trash2, RotateCcw, Check, X } from 'lucide-react';
import SEO from '../SEO';

const Counter = () => {
  const { theme } = useTheme();
  const [counters, setCounters] = useState(() => {
    const saved = localStorage.getItem('dailyCounters');
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'Water (Glasses)', count: 0 }];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newCounterName, setNewCounterName] = useState('');

  useEffect(() => {
    localStorage.setItem('dailyCounters', JSON.stringify(counters));
  }, [counters]);

  const addCounter = () => {
    if (newCounterName.trim()) {
      setCounters([...counters, { id: Date.now(), name: newCounterName, count: 0 }]);
      setNewCounterName('');
      setIsAdding(false);
    }
  };

  const removeCounter = (id) => {
    setCounters(counters.filter(c => c.id !== id));
  };

  const updateCount = (id, delta) => {
    setCounters(counters.map(c => c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c));
  };

  const resetCount = (id) => {
    setCounters(counters.map(c => c.id === id ? { ...c, count: 0 } : c));
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-8 w-full max-w-4xl mx-auto ${theme.font}`}>
      <SEO 
        title="Daily Counter" 
        description="Track your daily habits, tasks, or items with this simple online tally counter. Add multiple counters and reset them easily."
        keywords="tally counter, daily counter, habit tracker, clicker, online counter"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md">
        Daily Counters
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {counters.map((counter) => (
          <div key={counter.id} className="bg-gray-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative group hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-blue-300 truncate pr-8" title={counter.name}>{counter.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => resetCount(counter.id)}
                  className="text-white/30 hover:text-white transition-colors"
                  title="Reset Counter"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => removeCounter(counter.id)}
                  className="text-white/30 hover:text-red-400 transition-colors"
                  title="Remove Counter"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => updateCount(counter.id, -1)}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-lg transition-colors active:scale-95"
              >
                <Minus size={24} />
              </button>
              
              <span className="text-6xl font-bold tabular-nums text-white drop-shadow-sm select-none">
                {counter.count}
              </span>

              <button
                onClick={() => updateCount(counter.id, 1)}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors active:scale-95"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Counter Card */}
        <div className="flex items-center justify-center min-h-[200px]">
          {isAdding ? (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-600 w-full animate-fade-in">
              <h3 className="text-lg font-medium text-white mb-4">New Counter</h3>
              <input
                type="text"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCounter()}
                placeholder="Name (e.g. Water)"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
                <button
                  onClick={addCounter}
                  className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors"
                >
                  <Check size={24} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-white/5 flex flex-col items-center justify-center text-white/30 hover:text-white transition-all duration-300 group"
            >
              <Plus size={48} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add Counter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Counter;
