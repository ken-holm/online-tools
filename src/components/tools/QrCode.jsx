import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link as LinkIcon, Palette } from 'lucide-react';
import SEO from '../SEO';

const QrCode = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('https://tools.holmcc.com');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const qrRef = useRef(null);

  const downloadQrCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font}`}>
      <SEO 
        title="QR Code Generator" 
        description="Create custom QR codes for URLs, text, Wi-Fi, and more. Customize colors and download as PNG."
        keywords="qr code generator, create qr code, make qr code, online qr tool, custom qr"
      />
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        QR Code Generator
      </h2>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-6">
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <LinkIcon size={16} />
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[100px] resize-none"
              placeholder="Enter text or URL here..."
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <Palette size={16} />
              Colors
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-xs text-gray-400 block mb-1">Foreground</span>
                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-600">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-sm font-mono text-white/70">{fgColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 block mb-1">Background</span>
                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-600">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-sm font-mono text-white/70">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Preview */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-xl mb-6 shadow-inner" ref={qrRef}>
            <QRCodeCanvas
              value={text}
              size={256}
              bgColor={bgColor}
              fgColor={fgColor}
              level={"H"}
              includeMargin={true}
            />
          </div>
          
          <button
            onClick={downloadQrCode}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Download size={20} />
            Download PNG
          </button>
        </div>

      </div>
    </div>
  );
};

export default QrCode;
