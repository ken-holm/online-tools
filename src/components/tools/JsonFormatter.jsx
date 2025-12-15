import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Braces, Copy, Check, FileJson, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import SEO from '../SEO';

const JsonFormatter = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  // Simple syntax highlighting
  const highlightJson = (json) => {
    if (!json) return null;
    const tokens = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return tokens.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'text-orange-400'; // number
            if (/^"/.test(match)) {        if (/:$/.test(match)) {
          cls = 'text-blue-400'; // key
        } else {
          cls = 'text-green-400'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-400'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-gray-500'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-8 w-full max-w-6xl mx-auto ${theme.font}`}>
      <SEO 
        title="JSON Formatter & Validator" 
        description="Format, validate, and minify JSON data online. Features syntax highlighting and error detection for developers."
        keywords="json formatter, json validator, json prettify, json minify, developer tools"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md flex items-center gap-3">
        <Braces size={40} className="text-blue-400" />
        JSON Formatter
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-[65vh]">
        
        {/* Input */}
        <div className="flex flex-col h-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
            <span className="text-white/70 font-medium text-sm flex items-center gap-2"><FileJson size={16} /> Input JSON</span>
            <button onClick={clearAll} className="text-gray-400 hover:text-red-400 transition-colors" title="Clear">
              <Trash2 size={18} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-gray-800 text-white border-none resize-none focus:outline-none font-mono text-sm"
            placeholder='Paste your JSON here...'
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col h-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden relative">
          <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
            <span className="text-white/70 font-medium text-sm">Output</span>
            <div className="flex items-center gap-2">
              <button onClick={formatJson} className="p-1.5 bg-gray-700 hover:bg-blue-600 rounded text-white transition-colors" title="Format">
                <Maximize2 size={16} />
              </button>
              <button onClick={minifyJson} className="p-1.5 bg-gray-700 hover:bg-blue-600 rounded text-white transition-colors" title="Minify">
                <Minimize2 size={16} />
              </button>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              <button onClick={handleCopy} className="text-gray-400 hover:text-green-400 transition-colors" title="Copy Output">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex-grow w-full p-4 bg-gray-900/50 text-white font-mono text-sm overflow-auto">
            {error ? (
              <div className="text-red-400 p-4 border border-red-500/30 rounded bg-red-500/10">
                <strong className="block mb-1">Invalid JSON:</strong>
                {error}
              </div>
            ) : (
              <pre dangerouslySetInnerHTML={{ __html: highlightJson(output) }} className="whitespace-pre-wrap break-words" />
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default JsonFormatter;
