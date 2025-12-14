import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Breathing = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Idle'); // Idle, Inhale, Hold, Exhale
  const [text, setText] = useState('Press Start');
  const [scale, setScale] = useState(1); // Scale for animation
  const [instruction, setInstruction] = useState('4-7-8 Breathing');

  useEffect(() => {
    let timeout;

    if (isActive) {
      const runCycle = async () => {
        // Inhale - 4 seconds
        setPhase('Inhale');
        setText('Inhale');
        setInstruction('Breathe in through nose');
        setScale(1.5);
        await new Promise(r => timeout = setTimeout(r, 4000));
        if (!isActive) return;

        // Hold - 7 seconds
        setPhase('Hold');
        setText('Hold');
        setInstruction('Hold breath');
        // Keep scale
        await new Promise(r => timeout = setTimeout(r, 7000));
        if (!isActive) return;

        // Exhale - 8 seconds
        setPhase('Exhale');
        setText('Exhale');
        setInstruction('Exhale through mouth');
        setScale(1);
        await new Promise(r => timeout = setTimeout(r, 8000));
        if (!isActive) return;
        
        // Loop happens automatically because useEffect dependency triggers? 
        // No, we need a recursive loop or a separate interval.
        // Let's use a recursive function inside useEffect is cleaner.
        runCycle(); 
      };

      runCycle();
    } else {
      clearTimeout(timeout);
      setPhase('Idle');
      setText('Press Start');
      setInstruction('4-7-8 Breathing');
      setScale(1);
    }

    return () => clearTimeout(timeout);
  }, [isActive]); // Only re-run when active state toggles. Note: The recursive call manages the loop.

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    // State resets via useEffect cleanup logic
  };

  // Expand feature
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic CSS for transition duration based on phase
  const getTransitionDuration = () => {
    switch (phase) {
      case 'Inhale': return 'duration-[4000ms]';
      case 'Hold': return 'duration-0'; // Should stay static, but keeping previous transform
      case 'Exhale': return 'duration-[8000ms]';
      default: return 'duration-500';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}>
      
      {/* Title / Instruction */}
      <h2 className={`text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {instruction}
      </h2>

      {/* Breathing Circle */}
      <div 
        className={`relative flex items-center justify-center cursor-pointer transition-all ${isExpanded ? 'scale-125' : 'scale-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click to expand/shrink"
      >
        {/* Outer Ring/Glow */}
        <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-xl transition-transform ease-linear ${getTransitionDuration()}`} 
             style={{ transform: `scale(${scale * 1.2})` }}></div>
        
        {/* Main Circle */}
        <div 
          className={`w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 border-4 border-white/50 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-transform ease-linear ${getTransitionDuration()}`}
          style={{ transform: `scale(${scale})` }}
        >
          <span className={`text-4xl md:text-6xl font-bold text-white drop-shadow-lg select-none transition-all duration-300 ${isExpanded ? 'scale-50' : ''}`}>
            {text}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className={`mt-16 flex space-x-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={handleStartStop}
          className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white transition-colors"
          aria-label={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? <Pause size={36} /> : <Play size={36} />}
        </button>
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 shadow-lg text-white transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={36} />
        </button>
      </div>

      <div className={`mt-8 text-white/50 text-sm max-w-md text-center transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
        <p>This technique promotes relaxation by extending the exhale. Inhale for 4s, hold for 7s, exhale for 8s.</p>
      </div>
    </div>
  );
};

export default Breathing;
