import React, { useEffect, useRef } from 'react';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const heroSec = heroRef.current;
    if (!container || !canvas || !heroSec) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    class Particle {
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor(x: number, y: number) {
        this.ox = x;
        this.oy = y;
        this.x = x + (Math.random() - 0.5) * 12;
        this.y = y + (Math.random() - 0.5) * 12;
        this.vx = 0;
        this.vy = 0;
        this.size = 1.6 + Math.random() * 0.8;
      }

      update(mx: number, my: number) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && mx !== -999) {
          const f = (110 - dist) / 110;
          this.vx -= (dx / dist) * f * 12;
          this.vy -= (dy / dist) * f * 12;
        }
        this.vx += (this.ox - this.x) * 0.08;
        this.vy += (this.oy - this.y) * 0.08;
        this.vx *= 0.82;
        this.vy *= 0.82;
        this.x += this.vx;
        this.y += this.vy;
        return Math.abs(this.vx) > 0.02 || Math.abs(this.vy) > 0.02 || Math.abs(this.ox - this.x) > 0.1;
      }
    }

    let particles: Particle[] = [];
    let mouseX = -999;
    let mouseY = -999;
    let isVisible = true;
    let isRunning = false;
    let animId: number;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (!W || !H) return;

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const isMobile = W < 640;
      const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (isMobile) {
        // High-impact 2-line layout for mobile screens
        const line1 = 'ALESHWARAM';
        const line2 = 'RAHUL';
        let fs = Math.min(H * 0.40, W * 0.135);
        ctx.font = `900 ${fs}px ${fontFamily}`;
        try {
          if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '4px';
        } catch (e) {}

        const maxW = W * 0.92;
        const w1 = ctx.measureText(line1).width;
        if (w1 > maxW && w1 > 0) {
          fs = Math.floor(fs * (maxW / w1));
          ctx.font = `900 ${fs}px ${fontFamily}`;
        }

        ctx.fillText(line1, W / 2, H * 0.32);
        ctx.fillText(line2, W / 2, H * 0.72);
      } else {
        // Desktop single-line wide layout
        const text = 'ALESHWARAM RAHUL';
        let fs = Math.min(H * 0.78, W * 0.088);
        ctx.font = `900 ${fs}px ${fontFamily}`;
        
        try {
          if ('letterSpacing' in ctx) {
            (ctx as any).letterSpacing = '6px';
          }
        } catch (e) {}

        const maxTextWidth = W * 0.96;
        let textWidth = ctx.measureText(text).width;
        if (textWidth > maxTextWidth && textWidth > 0) {
          fs = Math.floor(fs * (maxTextWidth / textWidth));
          ctx.font = `900 ${fs}px ${fontFamily}`;
        }

        ctx.fillText(text, W / 2, H / 2);
      }

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];
      
      // Precise sampling step to ensure W, M, and A have distinct, sharp diagonal & vertical dot channels
      const step = Math.max(3, Math.floor(5 * dpr));
      for (let y = 0; y < imgData.height; y += step) {
        for (let x = 0; x < imgData.width; x += step) {
          const idx = (y * imgData.width + x) * 4;
          if (imgData.data[idx + 3] > 110) {
            particles.push(new Particle(x / dpr, y / dpr));
          }
        }
      }
      wake();
    };

    const wake = () => {
      if (!isRunning && isVisible) {
        isRunning = true;
        animId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (!isVisible) {
        isRunning = false;
        return;
      }
      const W = container.clientWidth;
      const H = container.clientHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';

      let hasMotion = mouseX !== -999;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const moving = p.update(mouseX, mouseY);
        if (moving) hasMotion = true;
        ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
      }

      if (hasMotion) {
        animId = requestAnimationFrame(animate);
      } else {
        isRunning = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      wake();
    };

    const handleMouseLeave = () => {
      mouseX = -999;
      mouseY = -999;
      wake();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const r = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - r.left;
        mouseY = e.touches[0].clientY - r.top;
        wake();
      }
    };

    const handleTouchEnd = () => {
      mouseX = -999;
      mouseY = -999;
      wake();
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    canvas.addEventListener('touchstart', handleTouchMove, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          isVisible = e.isIntersecting;
          if (isVisible) {
            wake();
          } else {
            isRunning = false;
            cancelAnimationFrame(animId);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(heroSec);

    const ro = new ResizeObserver(init);
    ro.observe(container);
    init();
    const timeout = setTimeout(init, 20);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
      ro.disconnect();
      observer.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div id="hero" ref={heroRef}>
      <div className="hud-corners">
        <div className="hud-corner tl"></div>
        <div className="hud-corner tr"></div>
        <div className="hud-corner bl"></div>
        <div className="hud-corner br"></div>
      </div>

      <p className="hero-eyebrow" id="hero-eyebrow">Portfolio 2026 — Hyderabad, India</p>

      <div id="name-canvas-container" ref={containerRef}>
        <canvas id="name-canvas" ref={canvasRef}></canvas>
      </div>

      <p className="hero-subtitle" id="hero-subtitle">
        Software Developer &nbsp;·&nbsp; Full-Stack &nbsp;·&nbsp; Java
      </p>

      <div className="hero-cta-group" id="hero-cta">
        <a href="#projects" className="btn btn-hero btn-hero-primary">
          <span className="btn-hero-glow"></span>
          <span className="btn-hero-text">View Work</span>
          <span className="btn-hero-arrow">↗</span>
        </a>
        <a href="#contact" className="btn btn-hero btn-hero-outline">
          <span className="btn-hero-status-dot"></span>
          <span className="btn-hero-text">Get In Touch</span>
          <span className="btn-hero-arrow-subtle">→</span>
        </a>
      </div>

      <a href="#about" className="hero-scroll-hint" id="scroll-hint" aria-label="Scroll to About Section">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </a>
    </div>
  );
};
