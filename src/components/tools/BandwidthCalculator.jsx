import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { Clock } from 'lucide-react';

const BandwidthCalculator = () => {
  const { theme } = useTheme();
  const [fileSize, setFileSize] = useState('');
  const [fileUnit, setFileUnit] = useState('GB');
  const [speed, setSpeed] = useState('');
  const [speedUnit, setSpeedUnit] = useState('Mbps');
  const [timeResult, setTimeResult] = useState(null);

  const FILE_UNITS = {
    'KB': 1024 * 8, // bits
    'MB': 1024 * 1024 * 8,
    'GB': 1024 * 1024 * 1024 * 8,
    'TB': 1024 * 1024 * 1024 * 1024 * 8,
  };

  const SPEED_UNITS = {
    'Kbps': 1000,
    'Mbps': 1000 * 1000,
    'Gbps': 1000 * 1000 * 1000,
  };

  useEffect(() => {
    const size = parseFloat(fileSize);
    const spd = parseFloat(speed);

    if (size > 0 && spd > 0) {
      const totalBits = size * FILE_UNITS[fileUnit];
      const bitsPerSecond = spd * SPEED_UNITS[speedUnit];
      const seconds = totalBits / bitsPerSecond;
      setTimeResult(seconds);
    } else {
      setTimeResult(null);
    }
  }, [fileSize, fileUnit, speed, speedUnit]);

  const formatDuration = (totalSeconds) => {
    if (totalSeconds === Infinity || isNaN(totalSeconds)) return "Infinity";
    
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 ${theme.font} max-w-4xl mx-auto w-full`}>
      <SEO 
        title="Bandwidth Calculator" 
        description="Calculate how long it takes to download or upload a file based on file size and internet speed."
        keywords="bandwidth calculator, download time, upload time, transfer speed, file size calculator"
      />

      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        Bandwidth Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Input Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-fit">
          <h3 className="text-xl text-white font-semibold mb-6 border-b border-gray-700 pb-2">Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-medium">File Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="e.g. 50"
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                  min="0"
                />
                <select
                  value={fileUnit}
                  onChange={(e) => setFileUnit(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {Object.keys(FILE_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-medium">Internet Speed</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder="e.g. 100"
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                  min="0"
                />
                <select
                  value={speedUnit}
                  onChange={(e) => setSpeedUnit(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                   {Object.keys(SPEED_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
             <div className="pt-4">
               <p className="text-sm text-gray-500">
                 Enter the file size and your connection speed to see the estimated transfer time.
               </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-fit flex flex-col items-center justify-center min-h-[300px]">
           <h3 className="text-xl text-white font-semibold mb-6 border-b border-gray-700 pb-2 w-full">Estimated Time</h3>
           
           {timeResult !== null ? (
             <div className="flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
               <Clock size={64} className="text-blue-500 mb-4" />
               <p className="text-gray-400 text-lg">Transfer will take approximately:</p>
               <p className="text-3xl md:text-4xl font-bold text-white font-mono break-words w-full">
                 {formatDuration(timeResult)}
               </p>
               <p className="text-sm text-gray-500 mt-4">
                 (Theoretical max speed, actual time may vary)
               </p>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center text-gray-500">
               <Clock size={48} className="mb-4 opacity-20" />
               <p>Enter details to calculate time.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BandwidthCalculator;
