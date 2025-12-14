import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Edit2, Check } from 'lucide-react';
import SEO from '../SEO';

const Message = () => {
  const { theme } = useTheme();
  const [message, setMessage] = useState(() => {
    return localStorage.getItem('billboardMessage') || 'Be Right Back';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [inputMessage, setInputMessage] = useState(message);
  const textareaRef = useRef(null);
  
  // Expand feature
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('billboardMessage', message);
  }, [message]);

  const handleSave = () => {
    setMessage(inputMessage);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // Auto-focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 w-full ${theme.font} transition-all duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}>
      <SEO 
        title="Message Board" 
        description="A simple digital billboard. Display large, high-contrast messages on your screen. Useful for 'Be Right Back' or announcements."
        keywords="message board, digital billboard, full screen text, display message, sign"
      />
      
      {/* Display Mode */}
      {!isEditing && (
        <div 
          className="group relative flex flex-col items-center justify-center w-full text-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Click to expand/shrink"
        >
          <h1 className={`font-bold text-white leading-tight break-words max-w-full drop-shadow-xl transition-all duration-300 ${
            isExpanded 
              ? 'text-[15vw]' 
              : 'text-[10vw] md:text-[8vw]'
          }`}>
            {message}
          </h1>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setInputMessage(message);
              setIsEditing(true);
            }}
            className={`mt-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-all duration-300 ${
              isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
            }`}
            title="Edit Message"
          >
            <Edit2 size={24} />
          </button>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="w-full max-w-3xl animate-fade-in">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Edit Message</h3>
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 text-3xl md:text-5xl font-bold rounded-xl bg-gray-900 border-2 border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-center"
              rows={3}
              placeholder="Type your message here..."
            />
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg flex items-center space-x-2 transition-colors"
              >
                <Check size={20} />
                <span>Display</span>
              </button>
            </div>
            <p className="text-center text-gray-500 mt-4 text-sm">
              Tip: Press <strong>Enter</strong> to save
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
      {!isEditing && (
        <div 
          className="group relative flex flex-col items-center justify-center w-full text-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Click to expand/shrink"
        >
          <h1 className={`font-bold text-white leading-tight break-words max-w-full drop-shadow-xl transition-all duration-300 ${
            isExpanded 
              ? 'text-[15vw]' 
              : 'text-[10vw] md:text-[8vw]'
          }`}>
            {message}
          </h1>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setInputMessage(message);
              setIsEditing(true);
            }}
            className={`mt-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-all duration-300 ${
              isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
            }`}
            title="Edit Message"
          >
            <Edit2 size={24} />
          </button>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="w-full max-w-3xl animate-fade-in">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Edit Message</h3>
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 text-3xl md:text-5xl font-bold rounded-xl bg-gray-900 border-2 border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-center"
              rows={3}
              placeholder="Type your message here..."
            />
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg flex items-center space-x-2 transition-colors"
              >
                <Check size={20} />
                <span>Display</span>
              </button>
            </div>
            <p className="text-center text-gray-500 mt-4 text-sm">
              Tip: Press <strong>Enter</strong> to save
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
