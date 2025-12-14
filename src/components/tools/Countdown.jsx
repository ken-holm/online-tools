import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import useAlarm from '../../hooks/useAlarm';
import SEO from '../SEO';

const Countdown = () => {
  const { theme } = useTheme();
  const { triggerAlarm, requestNotificationPermission } = useAlarm();
  
  const [targetDate, setTargetDate] = useState(() => {
    const savedDate = localStorage.getItem('countdownTargetDate');
    if (savedDate) {
      return new Date(savedDate);
    }
    const now = new Date();
    return new Date(now.getFullYear() + 1, 0, 1);
  });
  
  const [timeLeft, setTimeLeft] = useState({});
  const [eventTitle, setEventTitle] = useState(() => {
    return localStorage.getItem('countdownEventTitle') || 'New Year';
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Track if we have already played the alarm for this completion
  const hasPlayedAlarmRef = useRef(false);

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { timeLeft, difference };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { timeLeft: newTimeLeft, difference } = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (difference <= 0 && !hasPlayedAlarmRef.current) {
        // Timer just finished
        hasPlayedAlarmRef.current = true;
        triggerAlarm(eventTitle, "The event has arrived!");
      } else if (difference > 0) {
        // Reset alarm flag if we are back in positive time (e.g. user changed date)
        hasPlayedAlarmRef.current = false;
      }

    }, 1000);

    localStorage.setItem('countdownTargetDate', targetDate.toISOString());
    localStorage.setItem('countdownEventTitle', eventTitle);

    return () => clearTimeout(timer);
  });

  const handleSetTarget = () => {
    const newTarget = new Date(`${inputDate}T${inputTime}`);
    if (!isNaN(newTarget.getTime())) {
      setTargetDate(newTarget);
      setEventTitle(inputTitle || 'Custom Event');
      setIsEditing(false);
      hasPlayedAlarmRef.current = false; // Reset alarm flag for new event
      requestNotificationPermission(); // Ask for permission when setting
    } else {
      alert('Please enter a valid date and time.');
    }
  };

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }
    timerComponents.push(
      <span key={interval} className="flex flex-col items-center mx-2 md:mx-4">
        <span className={`font-bold tabular-nums text-white leading-none ${isExpanded ? 'text-7xl md:text-9xl' : 'text-5xl md:text-7xl'}`}>
          {timeLeft[interval] < 10 ? '0' + timeLeft[interval] : timeLeft[interval]}
        </span>
        <span className={`font-light text-white/70 uppercase ${isExpanded ? 'text-xl md:text-3xl' : 'text-lg md:text-2xl'}`}>
          {interval}
        </span>
      </span>
    );
  });

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}
    >
      <SEO 
        title="Countdown Timer" 
        description="Create a custom countdown timer for your important events. Features audio alerts and full-screen mode."
        keywords="countdown, timer, event timer, alarm, online countdown"
      />
      <h2 
        className={`font-semibold text-white/90 drop-shadow-md text-center transition-all duration-300 ${isExpanded ? 'text-4xl md:text-6xl mb-8' : 'text-2xl md:text-4xl mb-6'}`}
      >
        {eventTitle}
      </h2>

      {timerComponents.length ? (
        <div 
          className={`flex justify-center mb-8 flex-wrap cursor-pointer transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}
          onClick={() => setIsExpanded(!isExpanded)}
          title="Click to expand/shrink"
        >
          {timerComponents}
        </div>
      ) : (
        <h2 className="text-4xl md:text-6xl font-bold text-green-400 mb-8 animate-pulse">Event Has Arrived!</h2>
      )}

      {!isEditing && (
        <div className={`mt-8 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={() => {
              setIsEditing(true);
              const yyyy = targetDate.getFullYear();
              const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
              const dd = String(targetDate.getDate()).padStart(2, '0');
              const hh = String(targetDate.getHours()).padStart(2, '0');
              const min = String(targetDate.getMinutes()).padStart(2, '0');
              setInputDate(`${yyyy}-${mm}-${dd}`);
              setInputTime(`${hh}:${min}`);
              setInputTitle(eventTitle);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md text-lg font-medium text-white transition-colors"
          >
            Set New Countdown
          </button>
        </div>
      )}

      {isEditing && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full">
          <div className="mb-4">
            <label htmlFor="inputTitle" className="block text-white/70 text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              id="inputTitle"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="e.g., My Birthday"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="inputDate" className="block text-white/70 text-sm font-medium mb-1">Target Date</label>
            <input
              type="date"
              id="inputDate"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="inputTime" className="block text-white/70 text-sm font-medium mb-1">Target Time</label>
            <input
              type="time"
              id="inputTime"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSetTarget}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              Save Countdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Countdown;
