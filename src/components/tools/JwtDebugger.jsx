import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { Lock, FileJson, AlertCircle } from 'lucide-react';

const JwtDebugger = () => {
  const { theme } = useTheme();
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setHeader(null);
      setPayload(null);
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: Must have 3 parts (Header.Payload.Signature)');
      }

      const decodePart = (part) => {
        // Fix base64url to base64
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        // Decode
        const json = decodeURIComponent(escape(window.atob(base64)));
        return JSON.parse(json);
      };

      const headerObj = decodePart(parts[0]);
      const payloadObj = decodePart(parts[1]);

      setHeader(JSON.stringify(headerObj, null, 2));
      setPayload(JSON.stringify(payloadObj, null, 2));
      setError(null);
    } catch (e) {
      setError(e.message || 'Error decoding JWT');
      setHeader(null);
      setPayload(null);
    }
  }, [token]);

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 ${theme.font} max-w-6xl mx-auto w-full`}>
      <SEO 
        title="JWT Debugger" 
        description="Decode and inspect JSON Web Tokens (JWT). View header, payload, and signature details."
        keywords="jwt decoder, jwt debugger, json web token, decode jwt, jwt inspector"
      />

      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        JWT Debugger
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Input Column */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-full">
            <label className="block text-gray-400 mb-2 font-medium">Encoded Token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT here (eyJ...)"
              className="w-full h-96 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono resize-none text-sm break-all"
            />
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2 border border-red-500/30">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
             <h3 className="text-xl text-gray-300 font-semibold mb-2 ml-2 flex items-center gap-2">
               <span className="text-xs font-mono bg-red-500 text-white px-2 py-0.5 rounded">HEADER</span>
               <span className="text-sm opacity-50">Algorithm & Token Type</span>
             </h3>
             <pre className="bg-gray-900 p-4 rounded-xl text-red-400 font-mono text-sm overflow-x-auto min-h-[100px]">
               {header || '// Header will appear here'}
             </pre>
          </div>

          {/* Payload */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
             <h3 className="text-xl text-gray-300 font-semibold mb-2 ml-2 flex items-center gap-2">
               <span className="text-xs font-mono bg-purple-500 text-white px-2 py-0.5 rounded">PAYLOAD</span>
               <span className="text-sm opacity-50">Data</span>
             </h3>
             <pre className="bg-gray-900 p-4 rounded-xl text-purple-400 font-mono text-sm overflow-x-auto min-h-[200px]">
               {payload || '// Payload will appear here'}
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtDebugger;
