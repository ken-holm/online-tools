import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = '';

    if (!is24HourFormat) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return { timeStr: `${hours}:${minutes}:${seconds}`, ampm };
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const { timeStr, ampm } = formatTime(time);

  return (
    <div 
      className={`flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
        isExpanded ? 'scale-150' : 'scale-100'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
      title="Click to expand/shrink"
    >
      <div className="relative group">
        <h2 className={`font-bold tabular-nums leading-none tracking-tight text-white drop-shadow-lg ${
          isExpanded ? 'text-[15vw]' : 'text-[12vw] sm:text-[10vw]'
        }`}>
          {timeStr}
          {!is24HourFormat && (
            <span className="text-[0.3em] ml-4 font-light text-white/60">{ampm}</span>
          )}
        </h2>
      </div>

      <p className={`text-white/80 font-medium tracking-wide drop-shadow-md mt-4 transition-opacity duration-300 ${
        isExpanded ? 'text-2xl opacity-50' : 'text-xl sm:text-2xl opacity-100'
      }`}>
        {formatDate(time)}
      </p>

      {/* Control visible only on hover/standard mode to keep it clean */}
      <div 
        className={`mt-12 transition-all duration-300 ${
          isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking toggle
      >
        <button
          onClick={() => setIs24HourFormat(!is24HourFormat)}
          className="px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium backdrop-blur-sm transition-colors"
        >
          Switch to {is24HourFormat ? '12-Hour' : '24-Hour'}
        </button>
      </div>
    </div>
  );
};

export default Clock;
