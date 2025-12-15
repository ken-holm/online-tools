import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { isValidIpv4, isValidIpv6, getIpType } from '../../utils/ipUtils';
import { CheckCircle, XCircle, Globe, Shield } from 'lucide-react';

const IpValidator = () => {
  const { theme } = useTheme();
  const [ip, setIp] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!ip) {
      setResult(null);
      return;
    }

    const type = getIpType(ip);
    const valid = type !== 'Invalid IP';
    setResult({ valid, type });
  }, [ip]);

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 ${theme.font} max-w-4xl mx-auto w-full`}>
      <SEO 
        title="IPv4/IPv6 Validator" 
        description="Validate and classify IPv4 and IPv6 addresses. Identify public, private, and loopback ranges."
        keywords="ip validator, check ip, ipv4 validation, ipv6 validation, ip address checker"
      />

      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        IPv4/IPv6 Validator
      </h2>

      <div className="w-full max-w-xl space-y-8">
        {/* Input */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
           <label className="block text-gray-400 mb-2 font-medium">IP Address</label>
           <input
             type="text"
             value={ip}
             onChange={(e) => setIp(e.target.value)}
             placeholder="e.g. 192.168.1.1 or 2001:db8::1"
             className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg font-mono transition-all"
           />
        </div>

        {/* Result Card */}
        {result && (
           <div className={`p-6 rounded-2xl shadow-xl border transition-all duration-300 transform ${
             result.valid 
               ? 'bg-gray-800 border-green-500/50' 
               : 'bg-gray-800 border-red-500/50'
           }`}>
             <div className="flex items-center gap-4 mb-4">
               {result.valid ? (
                 <CheckCircle className="text-green-500" size={40} />
               ) : (
                 <XCircle className="text-red-500" size={40} />
               )}
               <div>
                 <h3 className={`text-2xl font-bold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                   {result.valid ? 'Valid IP Address' : 'Invalid IP Address'}
                 </h3>
                 <p className="text-gray-400">
                   {result.valid ? 'The format is correct.' : 'The format does not match IPv4 or IPv6 standards.'}
                 </p>
               </div>
             </div>

             {result.valid && (
               <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 mt-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    {result.type.includes('Private') || result.type.includes('Loopback') ? (
                       <Shield className="text-orange-400" size={24} />
                    ) : (
                       <Globe className="text-blue-400" size={24} />
                    )}
                    <span className="text-white font-mono text-lg">{result.type}</span>
                 </div>
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default IpValidator;
