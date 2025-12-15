import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Eye, Edit3, Trash2, Copy, Check } from 'lucide-react';
import SEO from '../SEO';

const defaultMarkdown = `# Hello, Markdown!\n\nThis is a **live preview** of your markdown.\n\n## Features\n*   Full GitHub Flavored Markdown support\n*   Tables, lists, and code blocks\n*   Real-time rendering\n\n### Code Example\n\
const sayHello = () => {\n  console.log(\"Hello, World!\");\n};\n\
\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |\n\n> Enjoy writing!\n`;

const MarkdownViewer = () => {
  const { theme } = useTheme();
  const [markdown, setMarkdown] = useState(() => localStorage.getItem('markdownText') || defaultMarkdown);
  const [view, setView] = useState('split'); // 'split', 'editor', 'preview' (for mobile mostly)
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('markdownText', markdown);
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setMarkdown('');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 md:p-8 w-full max-w-7xl mx-auto ${theme.font}`}>
      <SEO 
        title="Markdown Viewer" 
        description="A real-time Markdown editor and previewer. Support for GitHub Flavored Markdown (GFM), tables, and code blocks."
        keywords="markdown viewer, markdown editor, live preview, gfm, online markdown"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md flex items-center gap-3">
        <FileText size={40} className="text-blue-400" />
        Markdown Viewer
      </h2>

      {/* Toolbar */}
      <div className="w-full flex justify-between items-center mb-4 bg-gray-800 p-3 rounded-xl border border-gray-700">
        <div className="flex gap-2">
          <button 
            onClick={() => setView('split')}
            className={`hidden md:flex px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Split View
          </button>
          <button 
            onClick={() => setView('editor')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${view === 'editor' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <Edit3 size={14} /> Editor
          </button>
          <button 
            onClick={() => setView('preview')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${view === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <Eye size={14} /> Preview
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Copy Markdown">
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
          <button onClick={handleClear} className="p-2 text-gray-400 hover:text-red-400 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Clear">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="w-full h-[70vh] grid md:grid-cols-2 gap-6 relative">
        
        {/* Editor Pane */}
        <div className={`h-full flex flex-col ${view === 'preview' ? 'hidden md:hidden' : ''} ${view === 'split' ? 'hidden md:flex' : ''} ${view === 'editor' ? 'flex md:flex col-span-2' : ''}`}>
          <div className="bg-gray-800 rounded-t-xl px-4 py-2 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider font-bold">
            Input
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full p-4 bg-gray-900 text-gray-300 font-mono text-sm resize-none focus:outline-none rounded-b-xl border border-gray-700 focus:border-blue-500/50"
            placeholder="Type your markdown here..."
            spellCheck="false"
          />
        </div>

        {/* Preview Pane */}
        <div className={`h-full flex flex-col ${view === 'editor' ? 'hidden md:hidden' : ''} ${view === 'split' ? 'hidden md:flex' : ''} ${view === 'preview' ? 'flex md:flex col-span-2' : ''}`}>
          <div className="bg-gray-800 rounded-t-xl px-4 py-2 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider font-bold">
            Preview
          </div>
          <div className="w-full h-full p-6 bg-gray-900 rounded-b-xl border border-gray-700 overflow-y-auto prose prose-invert prose-sm md:prose-base max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarkdownViewer;
