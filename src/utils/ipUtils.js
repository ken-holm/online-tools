export const isValidIpv4 = (ip) => {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
};

export const isValidIp = isValidIpv4; // Alias for backward compatibility

export const isValidIpv6 = (ip) => {
    const regex = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/;
    return regex.test(ip);
};

export const getIpType = (ip) => {
    if (isValidIpv4(ip)) {
        const long = ipToLong(ip);
        if (long >= 167772160 && long <= 184549375) return 'IPv4 - Private (Class A)';
        if (long >= 2886729728 && long <= 2887778303) return 'IPv4 - Private (Class B)';
        if (long >= 3232235520 && long <= 3232301055) return 'IPv4 - Private (Class C)';
        if (long >= 2130706432 && long <= 2147483647) return 'IPv4 - Loopback';
        return 'IPv4 - Public';
    }
    if (isValidIpv6(ip)) {
        if (ip === '::1') return 'IPv6 - Loopback';
        if (ip.startsWith('fe80:')) return 'IPv6 - Link-Local';
        if (ip.startsWith('fc00:') || ip.startsWith('fd00:')) return 'IPv6 - Unique Local';
        return 'IPv6 - Public/Global';
    }
    return 'Invalid IP';
};

export const ipToLong = (ip) => {
  if (!isValidIpv4(ip)) return null;
  return (
    ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
};

export const longToIp = (long) => {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join('.');
};

export const calculateSubnet = (ip, cidr) => {
  if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

  const ipLong = ipToLong(ip);
  const subnetMaskLong = -1 << (32 - cidr);
  const networkLong = (ipLong & subnetMaskLong) >>> 0;
  const broadcastLong = (networkLong | ~subnetMaskLong) >>> 0;

  const firstUsableLong = (networkLong + 1) >>> 0;
  const lastUsableLong = (broadcastLong - 1) >>> 0;
  
  // Handle edge cases for /31 and /32 if strictly following RFCs, 
  // but for general calculator /32 has 1 host, /31 usually P2P.
  // We'll stick to standard logic:
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

  return {
    ip,
    cidr,
    subnetMask: longToIp(subnetMaskLong),
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    firstUsable: cidr >= 31 ? 'N/A' : longToIp(firstUsableLong),
    lastUsable: cidr >= 31 ? 'N/A' : longToIp(lastUsableLong),
    totalHosts: totalHosts,
    usableHosts: usableHosts < 0 ? 0 : usableHosts,
    wildcardMask: longToIp(~subnetMaskLong >>> 0),
    type: 
       (ipLong >= 167772160 && ipLong <= 184549375) ? 'Private (Class A)' :
       (ipLong >= 2886729728 && ipLong <= 2887778303) ? 'Private (Class B)' :
       (ipLong >= 3232235520 && ipLong <= 3232301055) ? 'Private (Class C)' :
       (ipLong >= 2130706432 && ipLong <= 2147483647) ? 'Loopback' :
       'Public'
  };
};
