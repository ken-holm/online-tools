import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Copy, Check, Type, AlignLeft, Hash } from 'lucide-react';
import SEO from '../SEO';

const TextUtilities = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    sentences: 0,
    paragraphs: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const trimmed = text.trim();
    setStats({
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      chars: text.length,
      sentences: trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n+/).length : 0,
    });
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transformText = (type) => {
    let newText = text;
    switch (type) {
      case 'uppercase':
        newText = text.toUpperCase();
        break;
      case 'lowercase':
        newText = text.toLowerCase();
        break;
      case 'titlecase':
        newText = text.toLowerCase().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        break;
      case 'camelcase':
        newText = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snakecase':
        newText = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        break;
      case 'kebabcase':
        newText = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        break;
      default:
        break;
    }
    setText(newText);
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-8 w-full max-w-6xl mx-auto ${theme.font}`}>
      <SEO 
        title="Text Utilities" 
        description="Analyze and transform your text. Count words, characters, sentences. Convert case (uppercase, lowercase, camelCase, etc.)."
        keywords="word counter, character count, text converter, case converter, text tools"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md flex items-center gap-3">
        <Type size={40} className="text-blue-400" />
        Text Utilities
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        
        {/* Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-96 p-4 bg-gray-900 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
              placeholder="Paste or type your text here..."
            />
            <button
              onClick={handleCopy}
              className="absolute top-6 right-6 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              title="Copy Text"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Sidebar: Stats & Tools */}
        <div className="space-y-6">
          
          {/* Stats Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hash size={18} /> Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-blue-400 tabular-nums">{stats.words}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Words</span>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-purple-400 tabular-nums">{stats.chars}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Chars</span>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-green-400 tabular-nums">{stats.sentences}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Sentences</span>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-orange-400 tabular-nums">{stats.paragraphs}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Paragraphs</span>
              </div>
            </div>
          </div>

          {/* Tools Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlignLeft size={18} /> Transform
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => transformText('uppercase')} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">UPPERCASE</button>
              <button onClick={() => transformText('lowercase')} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">lowercase</button>
              <button onClick={() => transformText('titlecase')} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">Title Case</button>
              <button onClick={() => transformText('camelcase')} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">camelCase</button>
              <button onClick={() => transformText('snakecase')} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">snake_case</button>
              <button onClick={() => transformText('kebabcase')} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">kebab-case</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TextUtilities;
