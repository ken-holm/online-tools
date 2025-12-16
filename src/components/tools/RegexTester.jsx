import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { Regex, BookOpen, Search, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';

const CHEATSHEET = [
  { category: "Character Classes", items: [
      { code: ".", desc: "Any character except newline" },
      { code: "\\w", desc: "Word character (a-z, A-Z, 0-9, _)" },
      { code: "\\d", desc: "Digit (0-9)" },
      { code: "\\s", desc: "Whitespace (space, tab, newline)" },
      { code: "[abc]", desc: "Any of a, b, or c" },
      { code: "[^abc]", desc: "Not a, b, or c" },
      { code: "[a-z]", desc: "Character between a and z" },
    ] 
  },
  { category: "Anchors", items: [
      { code: "^", desc: "Start of string/line" },
      { code: "$", desc: "End of string/line" },
      { code: "\\b", desc: "Word boundary" },
    ] 
  },
  { category: "Quantifiers", items: [
      { code: "*", desc: "0 or more" },
      { code: "+", desc: "1 or more" },
      { code: "?", desc: "0 or 1" },
      { code: "{3}", desc: "Exactly 3" },
      { code: "{3,}", desc: "3 or more" },
      { code: "{3,5}", desc: "Between 3 and 5" },
    ] 
  },
  { category: "Groups", items: [
      { code: "(...)", desc: "Capturing group" },
      { code: "(?:...)", desc: "Non-capturing group" },
      { code: "\\1", desc: "Backreference to group 1" },
    ] 
  },
];

const RegexTester = () => {
  const { theme } = useTheme();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.\nEmail: test@example.com\nPhone: 123-456-7890');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('test'); // 'test' or 'replace'
  const [showCheatsheet, setShowCheatsheet] = useState(true);

  // Stats
  const matchCount = matches.length;

  useEffect(() => {
    try {
      if (!pattern) {
        setMatches([]);
        setError(null);
        return;
      }

      const regex = new RegExp(pattern, flags);
      const newMatches = [];
      let match;

      // Handle global vs non-global
      if (flags.includes('g')) {
        const matchesIter = text.matchAll(regex);
        for (const m of matchesIter) {
           newMatches.push({
             index: m.index,
             text: m[0],
             groups: m.slice(1),
             length: m[0].length
           });
        }
      } else {
        match = text.match(regex);
        if (match) {
          newMatches.push({
            index: match.index,
            text: match[0],
            groups: match.slice(1),
            length: match[0].length
          });
        }
      }
      
      setMatches(newMatches);
      setError(null);
    } catch (e) {
      setError(e.message);
      setMatches([]);
    }
  }, [pattern, flags, text]);

  // Highlighting Logic
  const renderHighlightedText = () => {
    if (!pattern || error || matches.length === 0) return text;

    let lastIndex = 0;
    const elements = [];

    matches.forEach((match, i) => {
      // Text before match
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }

      // Match
      elements.push(
        <span key={i} className="bg-blue-500/40 border-b-2 border-blue-400 text-white rounded-[2px]" title={`Match ${i + 1}`}> 
          {match.text}
        </span>
      );

      lastIndex = match.index + match.length;
    });

    // Remaining text
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements;
  };
  
  const getReplacedText = () => {
      if (error || !pattern) return text;
      try {
          return text.replace(new RegExp(pattern, flags), replaceText);
      } catch(e) {
          return "Error in replacement";
      }
  };

  const toggleFlag = (flag) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 ${theme.font} max-w-7xl mx-auto w-full`}>
      <SEO 
        title="Regex Tester" 
        description="Test and debug regular expressions online. Real-time highlighting, substitution, and built-in cheatsheet."
        keywords="regex tester, regex debug, regular expression, regex replace, regex cheat sheet"
      />

      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center flex items-center gap-3">
        <Regex size={40} className="text-pink-500" />
        Regex Tester
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
        
        {/* Main Area */} 
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls */} 
          <div className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Insert your regular expression here..."
                  className={`w-full bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-lg py-3 px-8 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">/</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-900 px-3 rounded-lg border border-gray-600">
                <span className="text-gray-400 text-sm font-medium mr-1">Flags:</span>
                {['g', 'i', 'm', 's'].map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFlag(f)}
                    className={`w-8 h-8 rounded text-sm font-bold transition-all ${ 
                      flags.includes(f) 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-gray-500 hover:text-white hover:bg-gray-700'
                    }`}
                    title={
                        f === 'g' ? 'Global' : 
                        f === 'i' ? 'Case Insensitive' : 
                        f === 'm' ? 'Multiline' : 
                        'Dot All (Dot matches newline)'
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {error && (
               <div className="text-red-400 text-sm flex items-center gap-2">
                 <AlertCircle size={14} /> {error}
               </div>
            )}
          </div>

          {/* Mode Switcher */} 
          <div className="flex gap-1 bg-gray-800 p-1 rounded-lg w-fit border border-gray-700">
            <button
              onClick={() => setMode('test')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${ 
                mode === 'test' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search size={16} /> Match
            </button>
            <button
              onClick={() => setMode('replace')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${ 
                mode === 'replace' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <RefreshCw size={16} /> Replace
            </button>
          </div>

          {/* Test String Area */} 
          <div className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700 min-h-[400px] flex flex-col">
            <h3 className="text-gray-400 font-medium mb-2 text-sm">Test String</h3>
            
            <div className="relative flex-grow font-mono text-base leading-relaxed bg-gray-900 rounded-lg overflow-hidden border border-gray-600">
              {/* Highlight Overlay */} 
              <div 
                className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words text-transparent z-10"
                aria-hidden="true"
              >
                {renderHighlightedText()}
              </div>

              {/* Actual Input */} 
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-full p-4 bg-transparent text-white/80 caret-white resize-none focus:outline-none z-20 absolute inset-0 whitespace-pre-wrap break-words"
                spellCheck="false"
              />
            </div>
            
            <div className="mt-2 text-right text-gray-500 text-xs">
              {matchCount} match{matchCount !== 1 ? 'es' : ''} found
            </div>
          </div>

          {/* Replace Output (Conditional) */} 
          {mode === 'replace' && (
            <div className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700">
              <div className="mb-4">
                 <label className="text-gray-400 font-medium mb-2 block text-sm">Substitution</label>
                 <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replacement text (use $1 for groups)..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white font-mono focus:outline-none focus:border-green-500"
                 />
              </div>
              
              <h3 className="text-gray-400 font-medium mb-2 text-sm">Result</h3>
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-700 text-green-400 font-mono whitespace-pre-wrap break-words min-h-[100px]">
                {getReplacedText()}
              </div>
            </div>
          )}

          {/* Match Details (Test Mode) */} 
          {mode === 'test' && matches.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">Match Information</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {matches.map((m, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-400 font-bold font-mono">Match {i + 1}</span>
                      <span className="text-gray-500 text-xs">Index: {m.index} - {m.index + m.length}</span>
                    </div>
                    <div className="text-white font-mono break-all mb-2 pl-2 border-l-2 border-blue-500/30">
                      {m.text}
                    </div>
                    {m.groups.length > 0 && (
                      <div className="grid grid-cols-1 gap-1 pl-4">
                        {m.groups.map((g, gi) => (
                          <div key={gi} className="flex gap-2 text-xs font-mono">
                            <span className="text-purple-400">Group {gi + 1}:</span>
                            <span className="text-gray-300">{g || <i className="text-gray-600">undefined</i>}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Cheatsheet */} 
        <div className="lg:col-span-1">
          <button 
             onClick={() => setShowCheatsheet(!showCheatsheet)}
             className="lg:hidden w-full mb-4 bg-gray-700 p-2 rounded text-white flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> {showCheatsheet ? 'Hide' : 'Show'} Cheatsheet
          </button>

          <div className={`${showCheatsheet ? 'block' : 'hidden'} lg:block bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden sticky top-24`}>
             <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center gap-2">
               <BookOpen size={18} className="text-yellow-500" />
               <h3 className="text-white font-semibold">Cheatsheet</h3>
             </div>
             <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
                {CHEATSHEET.map((section, i) => (
                  <div key={i}>
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{section.category}</h4>
                    <ul className="space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex flex-col cursor-pointer group hover:bg-gray-700/50 p-1.5 rounded transition-colors"
                            onClick={() => setPattern(prev => prev + item.code)}
                            title="Click to insert"
                        >
                          <code className="text-blue-400 font-mono text-sm group-hover:text-blue-300">{item.code}</code>
                          <span className="text-gray-500 text-xs group-hover:text-gray-400">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegexTester;
