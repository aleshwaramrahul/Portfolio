import React, { useEffect, useRef, useState } from 'react';

export const Contact: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
    const canvas = canvasRef.current;
    const contactSec = sectionRef.current;
    if (!canvas || !contactSec) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}cinematic_particle_wave.png`;

    let offCanvas: HTMLCanvasElement | null = null;
    let isVisible = false;
    let isRunning = false;
    let W = 0, H = 0, DPR = 1;
    let animId: number;

    const wake = () => {
      if (isVisible && !isRunning && offCanvas) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const processImage = () => {
      if (!img.complete || !img.naturalWidth) return;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      offCanvas = document.createElement('canvas');
      offCanvas.width = nw;
      offCanvas.height = nh;
      const oCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!oCtx) return;
      oCtx.drawImage(img, 0, 0);
      const imgData = oCtx.getImageData(0, 0, nw, nh);
      const data = imgData.data;

      // Clean alpha extraction
      for (let y = 0; y < nh; y++) {
        for (let x = 0; x < nw; x++) {
          const i = (y * nw + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];

          const isOrange = r > 140 && b < 50 && g > 30;
          const lum = Math.max(r, Math.max(g, b));

          if (lum < 15 || isOrange) {
            data[i + 3] = 0;
          } else {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = Math.min(255, Math.floor((lum - 12) * 1.15));
          }
        }
      }
      oCtx.putImageData(imgData, 0, 0);
      wake();
    };

    img.onload = processImage;
    if (img.complete) processImage();

    const resize = () => {
      W = contactSec.clientWidth || window.innerWidth;
      H = contactSec.clientHeight || window.innerHeight;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
      wake();
    };

    const mouse = { x: -9999, y: -9999, currX: 0, currY: 0, targetX: 0, targetY: 0 };

    const handlePointer = (clientX: number, clientY: number) => {
      const rect = contactSec.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.targetX = ((clientX - rect.left) - W * 0.5) / (W * 0.5);
        mouse.targetY = ((clientY - rect.top) - H * 0.5) / (H * 0.5);
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.targetX = 0;
        mouse.targetY = 0;
      }
      wake();
    };

    const handleMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let start = performance.now();

    function render(now: number) {
      if (!isVisible || !offCanvas) {
        isRunning = false;
        return;
      }

      const t = (now - start) * 0.001;
      const phase = ((t % 8) / 8) * Math.PI * 2;

      ctx.clearRect(0, 0, W, H);

      mouse.currX += (mouse.targetX - mouse.currX) * 0.05;
      mouse.currY += (mouse.targetY - mouse.currY) * 0.05;

      const iw = offCanvas.width, ih = offCanvas.height;
      const scale = Math.max(W / iw, H / ih) * 1.15;
      const dw = iw * scale, dh = ih * scale;
      const ox = (W - dw) / 2 + mouse.currX * 16;
      const oy = (H - dh) + 35 + mouse.currY * 8;

      const strip = 4;
      for (let y = 0; y < H + 10; y += strip) {
        const rel = Math.max(0, (y - H * 0.40) / (H * 0.60));
        const envelope = rel * rel;

        const wave1 = Math.sin(y * 0.015 + phase) * 6.5;
        const wave2 = Math.cos(y * 0.035 - phase * 1.5) * 2.8;
        const ripple = Math.sin((y / H) * Math.PI * 4 - phase * 2.0) * 2.2;

        let dy = (wave1 + wave2 + ripple) * envelope;

        if (mouse.y > 0) {
          const distY = y - mouse.y;
          const sigma = 150;
          const gaussian = Math.exp(-(distY * distY) / (2 * sigma * sigma)) * envelope;
          dy -= gaussian * 16;
        }

        const sy = (y - oy - dy) / scale;
        const sh = strip / scale;
        if (sy + sh < 0 || sy > ih) continue;

        ctx.drawImage(offCanvas, 0, sy, iw, sh, ox, y, dw, strip);
      }

      // Batched living particle dust
      const seedCount = Math.floor(Math.min(120, (W * H) / 12000));
      ctx.beginPath();
      for (let i = 0; i < seedCount; i++) {
        const a = i * 12.9898;
        const px = ((Math.sin(a) * 0.5 + 0.5) * W) + mouse.currX * 10;
        const baseY = H * (0.54 + (Math.sin(a * 1.71) * 0.5 + 0.5) * 0.42);
        const py = baseY + Math.sin(phase + a) * 2.5 + mouse.currY * 6;
        const r = 0.4 + 1.2 * (0.5 + 0.5 * Math.sin(a * 2.7));
        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fill();

      animId = requestAnimationFrame(render);
    }

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
      { threshold: 0.02 }
    );
    observer.observe(contactSec);

    window.addEventListener('resize', resize, { passive: true });
    const timeout = setTimeout(resize, 80);
    wake();

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef}>
      <canvas id="particle-wave-canvas" ref={canvasRef}></canvas>
      <div className="contact-content-wrap">
        <div className="section-label reveal">06 / Contact</div>
        <div className="contact-big reveal">
          <span className="contact-solid">LET'S</span>
          <span className="contact-outline">BUILD</span>
        </div>
        <p className="contact-subtitle reveal">
          OPEN TO FULL-TIME ROLES, FREELANCE, &amp; COLLABORATIONS
        </p>
        <div className="contact-links reveal">
          <a href="mailto:aleshwaramrahul@gmail.com" className="contact-btn">
            <svg className="contact-btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span>EMAIL</span>
            <span className="contact-btn-arrow">↗</span>
          </a>

          <a href="tel:+917674885265" className="contact-btn">
            <svg className="contact-btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>+91 7674885265</span>
            <span className="contact-btn-arrow">↗</span>
          </a>

          <a href="https://github.com/aleshwaramrahul" className="contact-btn" target="_blank" rel="noopener noreferrer">
            <svg className="contact-btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GITHUB</span>
            <span className="contact-btn-arrow">↗</span>
          </a>

          <a href="https://linkedin.com" className="contact-btn" target="_blank" rel="noopener noreferrer">
            <svg className="contact-btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LINKEDIN</span>
            <span className="contact-btn-arrow">↗</span>
          </a>

          <a href="https://pin.it/41GSjWwTI" className="contact-btn" target="_blank" rel="noopener noreferrer">
            <svg className="contact-btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
            <span>PINTEREST</span>
            <span className="contact-btn-arrow">↗</span>
          </a>
        </div>
      </div>
      <div className="contact-footer-meta" id="footer-year">HYDERABAD, INDIA · {year}</div>
    </section>
  );
};
