import React, { useEffect, useRef } from 'react';

export const FlowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -9999;
    let mouseY = -9999;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    class Dot {
      dir: number;
      x: number;
      y: number;
      baseVx: number;
      baseVy: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      pulseSpeed: number;
      pulseVal: number;

      constructor(direction: number) {
        this.dir = direction;
        this.x = 0;
        this.y = 0;
        this.baseVx = 0;
        this.baseVy = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 0;
        this.alpha = 0;
        this.pulseSpeed = 0;
        this.pulseVal = 0;
        this.reset(true, direction);
      }

      reset(initial = false, direction: number | null = null) {
        this.dir = direction !== null ? direction : (Math.random() > 0.5 ? 1 : -1);
        this.x = initial ? Math.random() * width : (this.dir === 1 ? -10 : width + 10);
        this.y = Math.random() * height;
        
        // Constant, calm, peaceful ambient speed
        const speed = 0.22 + Math.random() * 0.25;
        this.baseVx = this.dir * speed;
        this.baseVy = (Math.random() - 0.5) * 0.06;
        
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        
        this.size = 1.0 + Math.random() * 1.5;
        this.alpha = 0.25 + Math.random() * 0.5;
        this.pulseSpeed = 0.01 + Math.random() * 0.015;
        this.pulseVal = Math.random() * Math.PI * 2;
      }

      update() {
        if (mouseX !== -9999 && mouseY !== -9999) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.hypot(dx, dy);
          const radius = 100;

          if (dist < radius && dist > 0.1) {
            const force = (1 - dist / radius) * 1.5;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            this.vx += fx;
            this.vy += fy;
          }
        }

        const scrollVel = (window as any).__scrollVelocity || 0;
        const scrollBoost = Math.max(-8, Math.min(8, -scrollVel * 0.1));
        
        this.vx += (this.baseVx - this.vx) * 0.03;
        this.vy += (this.baseVy + scrollBoost - this.vy) * 0.05;

        this.x += this.vx;
        this.y += this.vy;

        this.pulseVal += this.pulseSpeed;

        if (this.dir === 1 && this.x > width + 25) {
          this.x = -15;
          this.y = Math.random() * height;
        } else if (this.dir === -1 && this.x < -25) {
          this.x = width + 15;
          this.y = Math.random() * height;
        }

        if (this.y < -25) this.y = height + 15;
        if (this.y > height + 25) this.y = -15;
      }
    }

    let dots: Dot[] = [];
    const initDots = () => {
      dots = [];
      const count = Math.min(105, Math.max(65, Math.floor((width * height) / 16000) + 25));
      for (let i = 0; i < count; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        dots.push(new Dot(dir));
      }
    };
    initDots();

    let animId: number;
    let isVisible = true;

    const renderFlow = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // High performance 3-bucket batched rendering
      const b1: Dot[] = [];
      const b2: Dot[] = [];
      const b3: Dot[] = [];

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.update();
        if (dot.alpha < 0.45) b1.push(dot);
        else if (dot.alpha < 0.68) b2.push(dot);
        else b3.push(dot);
      }

      // Batch 1: Soft dots
      if (b1.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        for (let i = 0; i < b1.length; i++) {
          const d = b1[i];
          ctx.moveTo(d.x + d.size, d.y);
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Batch 2: Medium dots
      if (b2.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
        ctx.beginPath();
        for (let i = 0; i < b2.length; i++) {
          const d = b2[i];
          ctx.moveTo(d.x + d.size, d.y);
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Batch 3: Crisp glowing dots
      if (b3.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        for (let i = 0; i < b3.length; i++) {
          const d = b3[i];
          ctx.moveTo(d.x + d.size, d.y);
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(renderFlow);
    };

    animId = requestAnimationFrame(renderFlow);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        lastScrollY = window.scrollY;
        scrollVelocity = 0;
        animId = requestAnimationFrame(renderFlow);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <canvas id="flow-canvas" ref={canvasRef}></canvas>;
};
