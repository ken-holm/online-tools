import { useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const useAlarm = () => {
  const { theme } = useTheme();

  // Web Audio API helpers
  const createOscillator = (ctx, type, freq) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    return osc;
  };

  const createGain = (ctx) => {
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    return gain;
  };

  const playBeep = (ctx) => {
    const osc = createOscillator(ctx, 'sine', 880);
    const gain = createGain(ctx);
    osc.connect(gain);

    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  const playBell = (ctx) => {
    const fundamental = 523.25; // C5
    const ratios = [1, 2, 3, 4.2];
    const gainValues = [0.5, 0.3, 0.1, 0.05];

    ratios.forEach((ratio, i) => {
      const osc = createOscillator(ctx, 'sine', fundamental * ratio);
      const gain = createGain(ctx);
      osc.connect(gain);

      gain.gain.setValueAtTime(gainValues[i], ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0); // Long decay

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.0);
    });
  };

  const playDigital = (ctx) => {
    const osc = createOscillator(ctx, 'square', 900);
    const gain = createGain(ctx);
    osc.connect(gain);

    // Pulse 1
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
    
    // Pulse 2
    const osc2 = createOscillator(ctx, 'square', 900);
    const gain2 = createGain(ctx);
    osc2.connect(gain2);
    
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.25);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
    
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.3);
  };

  const playSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      
      switch (theme.alarmSound) {
        case 'bell':
          playBell(ctx);
          break;
        case 'digital':
          playDigital(ctx);
          break;
        case 'beep':
        default:
          playBeep(ctx);
          break;
      }
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }, [theme.alarmSound]);

  // Function to trigger browser notification
  const sendNotification = useCallback((title, body) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }, []);

  const triggerAlarm = useCallback((title = "Time's Up!", body = "Your timer has finished.") => {
    playSound();
    
    // Repeat sound for urgency unless it's a long sound like 'bell'
    if (theme.alarmSound !== 'bell') {
      setTimeout(playSound, 800);
      setTimeout(playSound, 1600);
    }
    
    sendNotification(title, body);
  }, [playSound, sendNotification, theme.alarmSound]);

  const requestNotificationPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return { triggerAlarm, requestNotificationPermission };
};

export default useAlarm;
