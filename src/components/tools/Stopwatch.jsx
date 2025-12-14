import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import SEO from '../SEO';

const Stopwatch = () => {
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in milliseconds
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastLapTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time; // Recalculate start time if paused and restarted
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10); // Update every 10ms for millisecond precision
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, time]); // Added 'time' to dependencies to ensure setInterval re-initializes correctly

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    clearInterval(timerRef.current);
    startTimeRef.current = 0;
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (isRunning) {
      const currentLapTime = time - lastLapTimeRef.current;
      setLaps((prevLaps) => [{ total: time, lap: currentLapTime }, ...prevLaps]);
      lastLapTimeRef.current = time;
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Display two digits for milliseconds
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}`;
  };

  // Expand feature (similar to Clock/Countdown)
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}>
      <SEO 
        title="Stopwatch" 
        description="A precise online stopwatch with lap timing functionality. Ideal for sports, study, and timing tasks."
        keywords="stopwatch, chronograph, online stopwatch, lap timer, timer"
      />
      <h2 className={`text-4xl md:text-6xl font-semibold text-white/90 mb-8 drop-shadow-md text-center transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        Stopwatch
      </h2>

      <div 
        className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isExpanded ? 'scale-125' : 'scale-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click to expand/shrink"
      >
        <span className={`font-bold tabular-nums text-white drop-shadow-lg transition-all duration-300 ${
          isExpanded ? 'text-[15vw] leading-none' : 'text-8xl md:text-9xl leading-none'
        }`}>
          {formatTime(time)}
        </span>
      </div>

      <div className={`mt-12 flex space-x-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={handleStartStop}
          className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white transition-colors"
          aria-label={isRunning ? 'Stop' : 'Start'}
        >
          {isRunning ? <Pause size={36} /> : <Play size={36} />}
        </button>
        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="p-4 rounded-full bg-green-600 hover:bg-green-700 shadow-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Lap"
        >
          <Flag size={36} />
        </button>
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 shadow-lg text-white transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={36} />
        </button>
      </div>

      {laps.length > 0 && (
        <div className={`mt-8 w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-xl font-semibold mb-4 text-white/90">Laps</h3>
          <div className="max-h-60 overflow-y-auto">
            {laps.map((lap, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <span className="text-lg font-mono text-white/70">Lap {laps.length - index}</span>
                <span className="text-xl font-mono text-white">{formatTime(lap.lap)}</span>
                <span className="text-lg font-mono text-white/50">{formatTime(lap.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
