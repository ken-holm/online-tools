import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, Plus, Minus } from 'lucide-react';
import SEO from '../SEO';

// Web Audio API context reference
let audioContext = null;
let clickGain = null; // Single gain for all clicks

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Master gain for metronome sounds
    clickGain = audioContext.createGain();
    clickGain.gain.setValueAtTime(0, audioContext.currentTime); // Start silent
    clickGain.connect(audioContext.destination);
  }
};

const playClick = (time) => {
  if (!audioContext) return;

  const osc = audioContext.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, time); // A3 frequency
  osc.connect(clickGain);

  clickGain.gain.setValueAtTime(0.5, time);
  clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.start(time);
  osc.stop(time + 0.05); // Short click
};

const Metronome = () => {
  const { theme } = useTheme();
  const [bpm, setBpm] = useState(() => parseInt(localStorage.getItem('metronomeBPM')) || 120);
  const [isRunning, setIsRunning] = useState(false);
  const [isBeatHighlight, setIsBeatHighlight] = useState(false);

  const schedulerRef = useRef(null);
  const nextBeatTimeRef = useRef(0);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudioContext();
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('metronomeBPM', bpm.toString());
  }, [bpm]);

  const scheduleBeat = useCallback(() => {
    if (!audioContext || !isRunning) return;

    const beatInterval = 60 / bpm; // Time in seconds per beat
    const lookahead = 0.1; // Schedule beats 100ms in advance
    const scheduleAheadTime = 0.2; // How far ahead to schedule audio (sec)

    while (nextBeatTimeRef.current < audioContext.currentTime + scheduleAheadTime) {
      playClick(nextBeatTimeRef.current); // No accent
      
      const visualHighlightTime = (nextBeatTimeRef.current - audioContext.currentTime) * 1000;
      setTimeout(() => {
        setIsBeatHighlight(true);
        setTimeout(() => setIsBeatHighlight(false), 100); // Highlight for 100ms
      }, visualHighlightTime);

      nextBeatTimeRef.current += beatInterval;
    }

    schedulerRef.current = setTimeout(scheduleBeat, lookahead * 1000);
  }, [bpm, isRunning]);

  useEffect(() => {
    if (isRunning) {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      nextBeatTimeRef.current = audioContext.currentTime + 0.1; // Schedule first beat slightly in future
      scheduleBeat();
    } else {
      clearTimeout(schedulerRef.current);
      setIsBeatHighlight(false);
    }
    return () => clearTimeout(schedulerRef.current);
  }, [isRunning, bpm, scheduleBeat]);

  const toggleMetronome = () => {
    setIsRunning((prev) => !prev);
  };

  const handleBpmChange = (amount) => {
    setBpm((prev) => Math.max(1, Math.min(300, prev + amount)));
  };

  // Expand feature
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}>
      <SEO 
        title="Metronome" 
        description="A simple, accurate online metronome. Adjustable BPM, visual pulse, and audio click for musicians and practice."
        keywords="metronome, online metronome, bpm counter, tempo, music practice"
      />
      <h2 className={`text-4xl md:text-6xl font-semibold text-white/90 mb-8 drop-shadow-md text-center transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        Metronome
      </h2>

      <div 
        className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isExpanded ? 'scale-125' : 'scale-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click to expand/shrink"
      >
        {/* Visual Beat Indicator */}
        <div 
          className={`absolute inset-0 rounded-full bg-blue-500/50 blur-xl opacity-0 transition-opacity duration-100 ${isBeatHighlight ? 'opacity-100' : ''}`}
          style={{ transform: `scale(${isBeatHighlight ? 1.2 : 1})` }}
        ></div>

        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 ${isBeatHighlight ? 'border-blue-400' : 'border-white/20'} bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-all duration-100`}>
          <span className={`text-8xl md:text-9xl font-bold tabular-nums text-white drop-shadow-lg`}>
            {bpm}
          </span>
        </div>
      </div>

      <div className={`mt-12 flex items-center space-x-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => handleBpmChange(-10)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 shadow-lg text-white transition-colors"
          aria-label="Decrease BPM by 10"
        >
          <Minus size={24} />
        </button>
        <button
          onClick={() => handleBpmChange(-1)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 shadow-lg text-white transition-colors"
          aria-label="Decrease BPM by 1"
        >
          <Minus size={20} />
        </button>
        
        <button
          onClick={toggleMetronome}
          className="p-5 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white transition-colors"
          aria-label={isRunning ? 'Pause Metronome' : 'Start Metronome'}
        >
          {isRunning ? <Pause size={36} /> : <Play size={36} />}
        </button>

        <button
          onClick={() => handleBpmChange(1)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 shadow-lg text-white transition-colors"
          aria-label="Increase BPM by 1"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => handleBpmChange(10)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 shadow-lg text-white transition-colors"
          aria-label="Increase BPM by 10"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Metronome;
