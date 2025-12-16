import React, { useState, useEffect, useRef } from 'react';
import SEO from '../SEO';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBinary, setIsBinary] = useState(false);
  const titleClickCount = useRef(0);
  const titleClickTimer = useRef(null);

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

    if (!is24HourFormat && !isBinary) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    const hStr = hours < 10 ? '0' + hours : '' + hours;
    const mStr = minutes < 10 ? '0' + minutes : '' + minutes;
    const sStr = seconds < 10 ? '0' + seconds : '' + seconds;

    return { 
      timeStr: `${hStr}:${mStr}:${sStr}`, 
      ampm,
      digits: [hStr[0], hStr[1], mStr[0], mStr[1], sStr[0], sStr[1]].map(Number)
    };
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    titleClickCount.current += 1;
    
    if (titleClickTimer.current) clearTimeout(titleClickTimer.current);

    titleClickTimer.current = setTimeout(() => {
      titleClickCount.current = 0;
    }, 500);

    if (titleClickCount.current === 3) {
      setIsBinary(!isBinary);
      titleClickCount.current = 0;
      clearTimeout(titleClickTimer.current);
    }
  };

  const { timeStr, ampm, digits } = formatTime(time);

  // Binary Render Helper
  const renderColumn = (val, maxBits) => {
    const bits = [];
    for(let i = 0; i < maxBits; i++) {
      bits.push((val >> i) & 1);
    }
    return bits.reverse().map((bit, i) => (
      <div 
        key={i} 
        className={`w-4 h-4 md:w-6 md:h-6 rounded-full transition-all duration-300 ${
          bit ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-800/50'
        }`}
      />
    ));
  };

  return (
    <>
      <SEO 
        title="Current Time" 
        description="A large, customizable digital clock displaying the current time and date. Perfect for full-screen display."
        keywords="clock, online clock, digital clock, current time, time, date"
      />
      
      <div className={`flex flex-col items-center justify-center min-h-full transition-all duration-500 w-full ${isExpanded ? 'scale-110' : ''}`}>
        
        {/* Title Trigger */}
        <h2 
          className={`text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center transition-all duration-300 cursor-pointer select-none hover:text-white ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
          onClick={handleTitleClick}
        >
          Current Time
        </h2>

        {isBinary ? (
          <div className="flex gap-4 md:gap-8 p-8 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl transition-all duration-500 hover:scale-105" onClick={() => setIsExpanded(!isExpanded)}>
             {/* HH */}
             <div className="flex gap-2">
               <div className="flex flex-col gap-2 justify-end">{renderColumn(digits[0], 2)}</div>
               <div className="flex flex-col gap-2 justify-end">{renderColumn(digits[1], 4)}</div>
             </div>
             {/* MM */}
             <div className="flex gap-2">
               <div className="flex flex-col gap-2 justify-end">{renderColumn(digits[2], 3)}</div>
               <div className="flex flex-col gap-2 justify-end">{renderColumn(digits[3], 4)}</div>
             </div>
             {/* SS */}
             <div className="flex gap-2">
               <div className="flex flex-col gap-2 justify-end">{renderColumn(digits[4], 3)}</div>
               <div className="flex flex-col gap-2 justify-end">{renderColumn(digits[5], 4)}</div>
             </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            title="Click to expand/shrink"
          >
            <div className="relative group">
              <h2 className={`font-bold tabular-nums leading-none tracking-tight text-white drop-shadow-lg transition-all duration-300 ${
                isExpanded ? 'text-[15vw]' : 'text-[12vw] sm:text-[10vw]'
              }`}>
                {timeStr}
                {!is24HourFormat && (
                  <span className="text-[0.3em] ml-4 font-light text-white/60">{ampm}</span>
                )}
              </h2>
            </div>
          </div>
        )}

        <p className={`text-white/80 font-medium tracking-wide drop-shadow-md mt-4 transition-opacity duration-300 ${
          isExpanded ? 'text-2xl opacity-50' : 'text-xl sm:text-2xl opacity-100'
        }`}>
          {isBinary ? 'Binary Mode' : formatDate(time)}
        </p>

        {/* Format Toggle (Only visible in normal mode) */}
        {!isBinary && (
          <div 
            className={`mt-12 transition-all duration-300 ${
              isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-0 hover:opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              onClick={() => setIs24HourFormat(!is24HourFormat)}
              className="px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium backdrop-blur-sm transition-colors"
            >
              Switch to {is24HourFormat ? '12-Hour' : '24-Hour'}
            </button>
          </div>
        )}

        {/* Hint for Binary Mode (Only when binary active) */}
        {isBinary && (
            <button 
                onClick={(e) => { e.stopPropagation(); setIsBinary(false); }}
                className="mt-8 text-xs text-green-500/50 hover:text-green-400 font-mono"
            >
                EXIT BINARY MODE
            </button>
        )}
      </div>
    </>
  );
};

export default Clock;