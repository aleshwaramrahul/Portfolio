import React, { useEffect, useRef, useState } from 'react';

export const HUD: React.FC = () => {
  const [time, setTime] = useState('--:--:--');
  const [year, setYear] = useState('2026');
  const coordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTimeAndYear = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
      setYear(String(now.getFullYear()));
    };

    updateTimeAndYear();
    const interval = setInterval(updateTimeAndYear, 1000);

    let rafId: number | null = null;
    let latestX = 0;
    let latestY = 0;

    const updateCoordsDOM = () => {
      if (coordsRef.current) {
        const xStr = String(Math.floor(latestX)).padStart(4, '0');
        const yStr = String(Math.floor(latestY)).padStart(4, '0');
        coordsRef.current.textContent = `X:${xStr} Y:${yStr}`;
      }
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateCoordsDOM);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      clearInterval(interval);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="hud-data" id="hud-tl">
        <span className="hud-line">SYS_STATUS // ONLINE</span>
        <span className="hud-line">NODE // HYD-001</span>
        <span className="hud-line" id="hud-time">{time}</span>
      </div>
      <div className="hud-data" id="hud-tr">
        <span className="hud-line">BUILD // v2.1.0</span>
        <span className="hud-line">STACK // FULL</span>
        <span className="hud-line">MODE // DARK</span>
      </div>
      <div className="hud-data" id="hud-bl">
        <span className="hud-line">ALESHWARAM RAHUL</span>
        <span className="hud-line" id="hud-year">© {year}</span>
      </div>
      <div className="hud-data" id="hud-br">
        <span className="hud-line" id="cursor-coords" ref={coordsRef}>X:0000 Y:0000</span>
        <span className="hud-line">PTR // ACTIVE</span>
      </div>
    </>
  );
};

