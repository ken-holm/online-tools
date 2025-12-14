import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import useAlarm from '../../hooks/useAlarm';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import SEO from '../SEO';

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

const Pomodoro = () => {
  const { theme } = useTheme();
  const { triggerAlarm, requestNotificationPermission } = useAlarm();

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Work'); // Work, Short Break, Long Break
  const [pomodoroCount, setPomodoroCount] = useState(0); // Completed work sessions
  const timerRef = useRef(null);
  const hasTriggeredAlarmRef = useRef(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerAlarm(`${sessionType} Finished!`, `Time for ${sessionType === 'Work' ? 'a break' : 'work'}!`);
      hasTriggeredAlarmRef.current = true; // Mark alarm as triggered

      // Move to next session
      if (sessionType === 'Work') {
        const newPomodoroCount = pomodoroCount + 1;
        setPomodoroCount(newPomodoroCount);
        if (newPomodoroCount % 4 === 0) {
          setSessionType('Long Break');
          setTimeLeft(LONG_BREAK_TIME);
        } else {
          setSessionType('Short Break');
          setTimeLeft(SHORT_BREAK_TIME);
        }
      } else {
        setSessionType('Work');
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(true); // Auto-start next session
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, sessionType, pomodoroCount, triggerAlarm]);

  // Reset alarm flag when session type changes or timer restarts manually
  useEffect(() => {
    hasTriggeredAlarmRef.current = false;
  }, [sessionType, isRunning]);


  const handleStartPause = () => {
    requestNotificationPermission();
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setSessionType('Work');
    setPomodoroCount(0);
    clearInterval(timerRef.current);
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    setIsRunning(false); // Pause before skipping to prevent immediate auto-restart loop
    
    // Logic similar to when timer reaches 0
    if (sessionType === 'Work') {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      if (newPomodoroCount % 4 === 0) {
        setSessionType('Long Break');
        setTimeLeft(LONG_BREAK_TIME);
      } else {
        setSessionType('Short Break');
        setTimeLeft(SHORT_BREAK_TIME);
      }
    } else {
      setSessionType('Work');
      setTimeLeft(WORK_TIME);
    }
    setIsRunning(true); // Auto-start next session
  };


  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Expand feature
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic styling based on session type
  const sessionColor = sessionType === 'Work' ? 'text-red-400' : 'text-green-400';

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}>
      <SEO 
        title="Pomodoro Timer" 
        description="Boost your productivity with this customizable Pomodoro timer. Track work sessions, short breaks, and long breaks."
        keywords="pomodoro, tomato timer, productivity, focus, work timer"
      />
      <h2 className={`text-4xl md:text-6xl font-semibold text-white/90 mb-6 drop-shadow-md text-center transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        Pomodoro Timer
      </h2>

      <div className={`text-xl md:text-3xl font-medium mb-4 ${sessionColor} transition-colors duration-500`}>
        {sessionType}
      </div>

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

      <div className={`mt-12 flex space-x-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={handleStartPause}
          className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white transition-colors"
          aria-label={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? <Pause size={36} /> : <Play size={36} />}
        </button>
        <button
          onClick={handleSkip}
          className="p-4 rounded-full bg-yellow-600 hover:bg-yellow-700 shadow-lg text-white transition-colors"
          aria-label="Skip Session"
        >
          <FastForward size={36} />
        </button>
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 shadow-lg text-white transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={36} />
        </button>
      </div>
      
      <div className={`mt-8 text-white/70 text-lg transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
        Completed Pomodoros: <span className="font-bold">{pomodoroCount}</span>
      </div>
    </div>
  );
};


