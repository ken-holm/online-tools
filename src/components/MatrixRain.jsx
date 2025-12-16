import React, { useEffect, useRef } from 'react';

const MatrixRain = ({ active, onExit }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / 20);
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const chars = "0123456789ABCDEF";

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
       width = window.innerWidth;
       height = window.innerHeight;
       canvas.width = width;
       canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onExit]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-auto cursor-pointer"
      onClick={onExit}
      style={{ background: 'black' }}
    />
  );
};

export default MatrixRain;
