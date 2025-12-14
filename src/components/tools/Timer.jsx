import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, RotateCcw } from 'lucide-react';
import useAlarm from '../../hooks/useAlarm';
import SEO from '../SEO';

const Timer = () => {
  const { theme } = useTheme();
  const { triggerAlarm, requestNotificationPermission } = useAlarm();
  
  const [duration, setDuration] = useState(() => {
    const savedDuration = localStorage.getItem('timerDuration');
    return savedDuration ? parseInt(savedDuration) : 600; // Default to 10 minutes (600 seconds)
  });
  
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(Math.floor(duration / 60));
  const [inputSeconds, setInputSeconds] = useState(duration % 60);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('timerDuration', duration.toString());
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerAlarm("Timer Finished", "Your timer has ended.");
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, triggerAlarm]);

  const handleStartPause = () => {
    if (!isRunning) {
      requestNotificationPermission(); // Request permission on start
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    clearInterval(timerRef.current);
  };

  const handleSaveDuration = () => {
    const newDuration = (parseInt(inputMinutes) || 0) * 60 + (parseInt(inputSeconds) || 0);
    if (newDuration > 0) {
      setDuration(newDuration);
      setTimeLeft(newDuration);
      setIsSetting(false);
      setIsRunning(false);
      clearInterval(timerRef.current);
      requestNotificationPermission(); // Request permission when setting duration
    } else {
      alert('Duration must be greater than 0.');
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Expand feature (similar to Clock/Countdown)
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}>
      <SEO 
        title="Timer" 
        description="A simple, clean online timer with custom duration, audio alarm, and browser notifications."
        keywords="timer, countdown, online timer, alarm, stopwatch"
      />
      <h2 className={`text-4xl md:text-6xl font-semibold text-white/90 mb-8 drop-shadow-md text-center transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        Timer
      </h2>

      <div 
        className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isExpanded ? 'scale-125' : 'scale-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click to expand/shrink"
      >
        <span className={`font-bold tabular-nums text-white drop-shadow-lg transition-all duration-300 ${
          isExpanded ? 'text-[15vw] leading-none' : 'text-8xl md:text-9xl leading-none'
        }`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {!isSetting && (
        <div className={`mt-12 flex space-x-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={handleStartPause}
            className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white transition-colors"
            aria-label={isRunning ? 'Pause' : 'Play'}
          >
            {isRunning ? <Pause size={36} /> : <Play size={36} />}
          </button>
          <button
            onClick={handleReset}
            className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 shadow-lg text-white transition-colors"
            aria-label="Reset"
          >
            <RotateCcw size={36} />
          </button>
          <button
            onClick={() => setIsSetting(true)}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
          >
            Set Duration
          </button>
        </div>
      )}

      {isSetting && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mt-8">
          <h3 className="text-xl font-semibold mb-4 text-white/90">Set Timer Duration</h3>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label htmlFor="inputMinutes" className="block text-white/70 text-sm font-medium mb-1">Minutes</label>
              <input
                type="number"
                id="inputMinutes"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="inputSeconds" className="block text-white/70 text-sm font-medium mb-1">Seconds</label>
              <input
                type="number"
                id="inputSeconds"
                value={inputSeconds}
                onChange={(e) => setInputSeconds(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsSetting(false);
                setInputMinutes(Math.floor(duration / 60));
                setInputSeconds(duration % 60);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDuration}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;

      <div 
        className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isExpanded ? 'scale-125' : 'scale-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click to expand/shrink"
      >
        <span className={`font-bold tabular-nums text-white drop-shadow-lg transition-all duration-300 ${
          isExpanded ? 'text-[15vw] leading-none' : 'text-8xl md:text-9xl leading-none'
        }`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {!isSetting && (
        <div className={`mt-12 flex space-x-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={handleStartPause}
            className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white transition-colors"
            aria-label={isRunning ? 'Pause' : 'Play'}
          >
            {isRunning ? <Pause size={36} /> : <Play size={36} />}
          </button>
          <button
            onClick={handleReset}
            className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 shadow-lg text-white transition-colors"
            aria-label="Reset"
          >
            <RotateCcw size={36} />
          </button>
          <button
            onClick={() => setIsSetting(true)}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
          >
            Set Duration
          </button>
        </div>
      )}

      {isSetting && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mt-8">
          <h3 className="text-xl font-semibold mb-4 text-white/90">Set Timer Duration</h3>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label htmlFor="inputMinutes" className="block text-white/70 text-sm font-medium mb-1">Minutes</label>
              <input
                type="number"
                id="inputMinutes"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="inputSeconds" className="block text-white/70 text-sm font-medium mb-1">Seconds</label>
              <input
                type="number"
                id="inputSeconds"
                value={inputSeconds}
                onChange={(e) => setInputSeconds(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsSetting(false);
                setInputMinutes(Math.floor(duration / 60));
                setInputSeconds(duration % 60);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDuration}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
