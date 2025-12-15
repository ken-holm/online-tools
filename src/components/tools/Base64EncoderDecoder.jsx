import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { ArrowDown, Copy, Check, Trash2 } from 'lucide-react';

const Base64EncoderDecoder = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [copied, setCopied] = useState(false);

  const handleTransform = () => {
    try {
      if (mode === 'encode') {
        // UTF-8 safe encoding
        setOutput(window.btoa(unescape(encodeURIComponent(input))));
      } else {
        // UTF-8 safe decoding
        setOutput(decodeURIComponent(escape(window.atob(input))));
      }
    } catch (e) {
      setOutput('Error: Invalid Base64 string or unsupported characters.');
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  // Auto-transform when switching modes if there is input
  React.useEffect(() => {
    if (input) handleTransform();
  }, [mode]);

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 ${theme.font} max-w-4xl mx-auto w-full`}>
      <SEO 
        title="Base64 Encoder/Decoder" 
        description="Encode text to Base64 or decode Base64 strings to text. Supports UTF-8 characters."
        keywords="base64 encode, base64 decode, utf8 base64, text to base64, base64 converter"
      />

      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        Base64 Encoder/Decoder
      </h2>

      <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-6">
        
        {/* Controls */}
        <div className="flex justify-center gap-4 bg-gray-900/50 p-2 rounded-xl w-fit mx-auto">
          <button
            onClick={() => setMode('encode')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'encode' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'decode' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Decode
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
           <div className="flex justify-between items-end">
            <label className="text-gray-400 font-medium ml-1">Input</label>
            <button 
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter text to ${mode}...`}
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono resize-y"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleTransform}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
            title={`Perform ${mode}`}
          >
            <ArrowDown size={24} />
          </button>
        </div>

        {/* Output */}
        <div className="space-y-2 relative">
          <label className="text-gray-400 font-medium ml-1">Output</label>
          <div className="relative">
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className="w-full h-32 bg-gray-950 border border-gray-700 rounded-xl p-4 text-purple-400 font-mono resize-y focus:outline-none"
            />
             {output && (
              <button
                onClick={handleCopy}
                className="absolute right-4 top-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white shadow-md transition-colors"
                title="Copy to Clipboard"
              >
                 {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Base64EncoderDecoder;
