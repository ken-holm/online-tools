import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) return;

    // Inject GA script if not already present
    const scriptId = 'ga-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
      `;
      document.head.appendChild(inlineScript);
    }
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return;

    // Send page view on route change
    window.gtag('config', measurementId, {
      page_path: location.pathname + location.search,
    });
  }, [location, measurementId]);

  return null;
};

export default Analytics;
