import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, RotateCcw, Settings, Type, MoveVertical, FlipHorizontal } from 'lucide-react';
import SEO from '../SEO';

const Prompter = () => {
  const { theme } = useTheme();
  const [text, setText] = useState(() => localStorage.getItem('prompterText') || 'Paste your script here...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1-10
  const [fontSize, setFontSize] = useState(48); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  
  const scrollerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('prompterText', text);
  }, [text]);

  const scroll = () => {
    if (scrollerRef.current && isPlaying) {
      scrollerRef.current.scrollTop += speed * 0.5;
      
      // Stop if reached bottom
      if (scrollerRef.current.scrollTop + scrollerRef.current.clientHeight >= scrollerRef.current.scrollHeight - 1) {
        setIsPlaying(false);
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(scroll);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(scroll);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying, speed]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleReset = () => {
    setIsPlaying(false);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-full w-full ${theme.font} h-screen overflow-hidden`}>
      <SEO 
        title="Teleprompter" 
        description="A free online teleprompter with scrolling text, adjustable speed, font size control, and mirror mode."
        keywords="teleprompter, online prompter, scrolling text, speech practice, mirror text"
      />
      
      {/* Editor / Prompter View Switch */}
      {isEditing ? (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl p-6 h-full">
          <h2 className="text-3xl font-bold text-white mb-6">Teleprompter Setup</h2>
          <textarea
            className="w-full h-full max-h-[60vh] p-4 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none resize-none mb-6 text-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your script here..."
          />
          <button
            onClick={() => setIsEditing(false)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Start Prompter
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col bg-black">
          {/* Prompter Display */}
          <div 
            ref={scrollerRef}
            className={`w-full h-full overflow-y-scroll hide-scrollbar px-12 md:px-24 py-[45vh] text-center leading-normal text-white ${isMirrored ? 'scale-x-[-1]' : ''}`}
            style={{ fontSize: `${fontSize}px` }}
            onClick={togglePlay} // Click screen to play/pause
          >
            {text.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 transition-opacity duration-300 opacity-100 hover:opacity-100 md:opacity-30 md:hover:opacity-100">
            
            <div className="flex items-center gap-4">
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white" title="Edit Script">
                <Settings size={20} />
              </button>
              <button onClick={handleReset} className="text-gray-400 hover:text-white" title="Reset to Top">
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={togglePlay} 
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>

            <div className="flex items-center gap-6">
              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <MoveVertical size={16} className="text-gray-400" />
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={speed} 
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24 accent-blue-500"
                  title="Scroll Speed"
                />
              </div>

              {/* Font Size Control */}
              <div className="flex items-center gap-2">
                <Type size={16} className="text-gray-400" />
                <input 
                  type="range" 
                  min="24" 
                  max="128" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 accent-blue-500"
                  title="Font Size"
                />
              </div>

              {/* Mirror Toggle */}
              <button 
                onClick={() => setIsMirrored(!isMirrored)}
                className={`p-2 rounded-lg transition-colors ${isMirrored ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                title="Mirror Text"
              >
                <FlipHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Prompter;
