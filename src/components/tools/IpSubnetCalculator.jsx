import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { calculateSubnet } from '../../utils/ipUtils';
import { Copy, Check } from 'lucide-react';

const IpSubnetCalculator = () => {
  const { theme } = useTheme();
  const [ip, setIp] = useState('');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    // Only attempt calculation if IP looks remotely valid to avoid spamming nulls
    // Simple check for at least one dot or some numbers
    if (ip.length > 0) {
      const res = calculateSubnet(ip, parseInt(cidr));
      setResult(res);
    } else {
      setResult(null);
    }
  }, [ip, cidr]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const ResultRow = ({ label, value, index }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-700 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
      <span className="text-gray-400 font-medium mb-1 sm:mb-0">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-white font-mono break-all text-right">{value}</span>
        <button
          onClick={() => handleCopy(value, index)}
          className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-gray-700"
          title="Copy"
        >
          {copiedIndex === index ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 ${theme.font} max-w-4xl mx-auto w-full`}>
      <SEO 
        title="IP Subnet Calculator" 
        description="Calculate network range, broadcast address, subnet mask, and usable IPs from an IP address and CIDR."
        keywords="subnet calculator, ip calculator, cidr, network mask, broadcast address, ip range"
      />
      
      <h2 className="text-3xl md:text-5xl font-semibold text-white/90 mb-8 drop-shadow-md text-center">
        IP Subnet Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Input Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-fit">
          <h3 className="text-xl text-white font-semibold mb-6 border-b border-gray-700 pb-2">Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-medium">IP Address</label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="e.g. 192.168.1.1"
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-medium">Subnet Mask (CIDR)</label>
              <select
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value))}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-mono appearance-none"
              >
                {Array.from({ length: 33 }, (_, i) => 32 - i).map((mask) => (
                  <option key={mask} value={mask}>
                    /{mask}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
               <p className="text-sm text-gray-500">
                 Enter an IP address and select the subnet mask to see the network details.
               </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-fit">
           <h3 className="text-xl text-white font-semibold mb-6 border-b border-gray-700 pb-2">Network Details</h3>
           
           {result ? (
             <div className="flex flex-col">
               <ResultRow label="Network Address" value={`${result.networkAddress}/${result.cidr}`} index="net" />
               <ResultRow label="Subnet Mask" value={result.subnetMask} index="mask" />
               <ResultRow label="Wildcard Mask" value={result.wildcardMask} index="wild" />
               <ResultRow label="Broadcast Address" value={result.broadcastAddress} index="bcast" />
               <ResultRow label="First Usable IP" value={result.firstUsable} index="first" />
               <ResultRow label="Last Usable IP" value={result.lastUsable} index="last" />
               <ResultRow label="Total Hosts" value={result.totalHosts.toLocaleString()} index="total" />
               <ResultRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} index="usable" />
               <ResultRow label="IP Class / Type" value={result.type} index="type" />
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-12 text-gray-500">
               {ip.length === 0 ? (
                 <p>Enter an IP address to begin.</p>
               ) : (
                 <p className="text-red-400">Invalid IP Address</p>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default IpSubnetCalculator;
