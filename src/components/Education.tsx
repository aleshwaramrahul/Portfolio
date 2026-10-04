import React, { useEffect, useRef } from 'react';
import { GEO } from '../data/globeData';

export const Education: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const TAU = Math.PI * 2;

    let W = 480, H = 480, DPR = 1;
    let cx = 240, cy = 240, baseR = 180;
    let rotation = 0;
    let tilt = 0;
    let last = performance.now();
    let animId: number;
    let isVisible = false;
    let isRunning = false;

    const mouse = {
      x: -9999, y: -9999,
      active: false,
      vx: 0, vy: 0,
      px: -9999, py: -9999,
      dragging: false,
      dragLastX: 0,
      dragLastY: 0,
      dragVelocity: 0,
      tiltVelocity: 0
    };

    // Full high-resolution geographical particle dataset
    const totalGeo = GEO.length;
    const coastThreshold = totalGeo - 2600;

    const pX0 = new Float32Array(totalGeo);
    const pY0 = new Float32Array(totalGeo);
    const pZ0 = new Float32Array(totalGeo);
    const pCoast = new Uint8Array(totalGeo);
    const pSeed = new Float32Array(totalGeo);

    for (let i = 0; i < totalGeo; i++) {
      const g = GEO[i];
      const lon = (g[0] * Math.PI) / 180;
      const lat = (g[1] * Math.PI) / 180;
      const cl = Math.cos(lat);
      pX0[i] = cl * Math.sin(lon);
      pY0[i] = Math.sin(lat);
      pZ0[i] = cl * Math.cos(lon);
      pCoast[i] = i >= coastThreshold ? 1 : 0;
      pSeed[i] = (i * 0.6180339887) % 1;
    }

    // Atmospheric spherical shell dust particles
    const shellCount = 1200;
    const sX0 = new Float32Array(shellCount);
    const sY0 = new Float32Array(shellCount);
    const sZ0 = new Float32Array(shellCount);
    const sSeed = new Float32Array(shellCount);

    for (let i = 0; i < shellCount; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * TAU;
      const r = Math.sqrt(Math.max(0, 1 - u * u));
      sX0[i] = Math.cos(a) * r;
      sY0[i] = u;
      sZ0[i] = Math.sin(a) * r;
      sSeed[i] = Math.random();
    }

    function resize() {
      if (!canvas || !ctx || !container) return;
      W = container.clientWidth || 480;
      H = container.clientHeight || 480;
      if (W < 100) W = 480;
      if (H < 100) H = 480;

      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      cx = W * 0.5;
      cy = H * 0.5;
      baseR = Math.min(W, H) * 0.40;
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();
    const tResize = setTimeout(resize, 100);

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const r = canvas.getBoundingClientRect();
      mouse.dragging = true;
      mouse.dragLastX = e.clientX;
      mouse.dragLastY = e.clientY;
      mouse.dragVelocity = 0;
      mouse.tiltVelocity = 0;
      mouse.px = e.clientX - r.left;
      mouse.py = e.clientY - r.top;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      canvas.style.cursor = "grabbing";
      e.preventDefault();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const lx = e.clientX - r.left;
      const ly = e.clientY - r.top;

      mouse.x = lx;
      mouse.y = ly;
      mouse.active = (lx >= 0 && lx <= W && ly >= 0 && ly <= H);
      mouse.vx = lx - mouse.px;
      mouse.vy = ly - mouse.py;

      if (mouse.dragging) {
        const dx = e.clientX - mouse.dragLastX;
        const dy = e.clientY - mouse.dragLastY;
        rotation -= (dx / baseR) * 1.35;
        tilt += (dy / baseR) * 1.15;
        tilt = Math.max(-1.45, Math.min(1.45, tilt));
        mouse.dragVelocity = (-dx / baseR) * 1.35;
        mouse.tiltVelocity = (dy / baseR) * 1.15;
        mouse.dragLastX = e.clientX;
        mouse.dragLastY = e.clientY;
      }

      mouse.px = lx;
      mouse.py = ly;
    };

    const stopDrag = () => {
      if (mouse.dragging) {
        mouse.dragging = false;
        canvas.style.cursor = "grab";
      }
    };

    const handlePointerLeave = () => {
      if (!mouse.dragging) {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.vx = 0;
        mouse.vy = 0;
      }
    };

    const handleBlur = () => {
      mouse.dragging = false;
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);
    canvas.addEventListener("lostpointercapture", stopDrag);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handleBlur);

    // 12 Fine-Grained Alpha Buckets for Butter-Smooth Depth Shading & High Framerate
    const NUM_BUCKETS = 12;
    const bucketAlphaValues = [0.07, 0.13, 0.19, 0.26, 0.34, 0.42, 0.51, 0.60, 0.70, 0.80, 0.89, 0.98];
    const bucketFillStyles = bucketAlphaValues.map(a => `rgba(238, 238, 238, ${a.toFixed(2)})`);

    const maxPts = totalGeo + shellCount;
    const bucketX = Array.from({ length: NUM_BUCKETS }, () => new Float32Array(maxPts));
    const bucketY = Array.from({ length: NUM_BUCKETS }, () => new Float32Array(maxPts));
    const bucketS = Array.from({ length: NUM_BUCKETS }, () => new Float32Array(maxPts));
    const bucketCounts = new Int32Array(NUM_BUCKETS);

    function draw(now: number) {
      if (!isRunning) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!mouse.dragging) {
        rotation += dt * 0.075;
        rotation += mouse.dragVelocity;
        tilt += mouse.tiltVelocity;
        tilt = Math.max(-1.45, Math.min(1.45, tilt));
        mouse.dragVelocity *= Math.pow(0.035, dt);
        mouse.tiltVelocity *= Math.pow(0.035, dt);
        if (Math.abs(mouse.dragVelocity) < 0.00001) mouse.dragVelocity = 0;
        if (Math.abs(mouse.tiltVelocity) < 0.00001) mouse.tiltVelocity = 0;
      }

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // Cyber ambient atmospheric halo
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.58, cx, cy, baseR * 1.12);
      glow.addColorStop(0, "rgba(255, 255, 255, 0.035)");
      glow.addColorStop(0.70, "rgba(255, 255, 255, 0.012)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - baseR * 1.3, cy - baseR * 1.3, baseR * 2.6, baseR * 2.6);

      // Trigonometric rotation constants
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const mouseActive = mouse.active;
      const mx = mouse.x;
      const my = mouse.y;
      const mvx = mouse.vx;
      const mvy = mouse.vy;
      const speed = Math.hypot(mvx, mvy);
      const influence = baseR * 0.92;
      const spreadFactor = baseR * 0.34;

      bucketCounts.fill(0);

      // Project Land Particles
      for (let i = 0; i < totalGeo; i++) {
        const x0 = pX0[i];
        const y0 = pY0[i];
        const z0 = pZ0[i];

        const rx = x0 * cosR - z0 * sinR;
        const rz = x0 * sinR + z0 * cosR;
        const ry = y0 * cosT - rz * sinT;
        const qz = y0 * sinT + rz * cosT;

        let qx = rx;
        let qy = ry;

        let force = 0;
        if (mouseActive) {
          const px = cx + qx * baseR;
          const py = cy - qy * baseR;
          const mdx = px - mx;
          const mdy = py - my;
          const dist = Math.hypot(mdx, mdy);
          const t = Math.max(0, 1 - dist / influence);
          force = Math.pow(t, 1.55);
          if (force > 0) {
            const inv = dist > 1 ? 1 / dist : 0;
            let dx = (mdx * inv) * force;
            let dy = (mdy * inv) * force;

            if (speed > 0.5) {
              const trail = force * Math.min(speed / 35, 1) * 0.42;
              dx += (-mvx / Math.max(speed, 1)) * trail;
              dy += (-mvy / Math.max(speed, 1)) * trail;
            }

            const nx = qx + dx * (spreadFactor / baseR);
            const ny = qy - dy * (spreadFactor / baseR);
            const len = Math.hypot(nx, ny, qz) || 1;
            qx = nx / len;
            qy = ny / len;
          }
        }

        const sx = cx + qx * baseR;
        const sy = cy - qy * baseR;

        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;

        const isCoast = pCoast[i];
        const seed = pSeed[i];
        const front = 0.18 + 0.82 * Math.max(0, qz * 0.5 + 0.5);
        const shimmer = force * (0.45 + 0.55 * Math.sin(now * 0.008 + seed * TAU));
        const size = (isCoast ? 1.15 : 0.82) + (seed > 0.92 ? 0.65 : 0) + shimmer * 0.55;
        const alpha = Math.min(0.95, (isCoast ? 0.65 : 0.38) * front + shimmer * 0.28);

        // Map alpha to fine bucket index [0..NUM_BUCKETS-1]
        let bIdx = Math.floor(alpha * NUM_BUCKETS);
        if (bIdx < 0) bIdx = 0;
        if (bIdx >= NUM_BUCKETS) bIdx = NUM_BUCKETS - 1;

        const count = bucketCounts[bIdx];
        bucketX[bIdx][count] = sx;
        bucketY[bIdx][count] = sy;
        bucketS[bIdx][count] = size;
        bucketCounts[bIdx] = count + 1;
      }

      // Shell silhouette points
      for (let s = 0; s < shellCount; s++) {
        const x0 = sX0[s];
        const y0 = sY0[s];
        const z0 = sZ0[s];

        const rx = x0 * cosR - z0 * sinR;
        const rz = x0 * sinR + z0 * cosR;
        const ry = y0 * cosT - rz * sinT;
        const qz = y0 * sinT + rz * cosT;

        if (qz < 0.12) continue;
        const edge = 1 - Math.abs(qz);
        if (sSeed[s] > 0.20 + edge * 0.45) continue;

        const sx = cx + rx * (baseR * (1.022 + 0.035 * sSeed[s]));
        const sy = cy - ry * (baseR * (1.022 + 0.035 * sSeed[s]));
        const size = 0.55 + 0.65 * sSeed[s];
        const a = (0.04 + 0.10 * edge) * (0.5 + 0.5 * qz);

        let bIdx = Math.floor(a * NUM_BUCKETS);
        if (bIdx < 0) bIdx = 0;
        if (bIdx >= NUM_BUCKETS) bIdx = NUM_BUCKETS - 1;

        const count = bucketCounts[bIdx];
        bucketX[bIdx][count] = sx;
        bucketY[bIdx][count] = sy;
        bucketS[bIdx][count] = size;
        bucketCounts[bIdx] = count + 1;
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Render buckets with batched subpaths
      for (let b = 0; b < NUM_BUCKETS; b++) {
        const count = bucketCounts[b];
        if (count === 0) continue;

        ctx.fillStyle = bucketFillStyles[b];
        ctx.beginPath();
        const xs = bucketX[b];
        const ys = bucketY[b];
        const ss = bucketS[b];

        for (let i = 0; i < count; i++) {
          const s = ss[i];
          ctx.moveTo(xs[i] + s, ys[i]);
          ctx.arc(xs[i], ys[i], s, 0, TAU);
        }
        ctx.fill();
      }

      ctx.restore();

      mouse.vx *= 0.84;
      mouse.vy *= 0.84;

      if (isVisible) {
        animId = requestAnimationFrame(draw);
      } else {
        isRunning = false;
      }
    }

    const wake = () => {
      if (isVisible && !isRunning) {
        isRunning = true;
        last = performance.now();
        animId = requestAnimationFrame(draw);
      }
    };

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
    if (section) observer.observe(section);

    wake();

    return () => {
      isRunning = false;
      clearTimeout(tResize);
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", handleBlur);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", stopDrag);
      canvas.removeEventListener("pointercancel", stopDrag);
      canvas.removeEventListener("lostpointercapture", stopDrag);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <section id="education" ref={sectionRef}>
      <div className="section-label reveal">05 / Education</div>
      <h2 className="section-title reveal">
        <span className="title-solid">ACADEMIC</span>{' '}
        <span className="title-outline">BACKGROUND</span>
      </h2>
      <div className="edu-grid">
        <div className="edu-list">
          <a
            href="https://www.spechyd.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-entry edu-link reveal"
          >
            <div className="edu-year">2022 — 2025</div>
            <div className="edu-info">
              <div className="edu-degree">
                B.Tech — Electrical &amp; Electronics Engineering
                <span className="edu-arrow">↗</span>
              </div>
              <div className="edu-school">St. Peter's Engineering College · Hyderabad, Telangana</div>
            </div>
          </a>

          <a
            href="https://tkrcet.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-entry edu-link reveal"
          >
            <div className="edu-year">2019 — 2022</div>
            <div className="edu-info">
              <div className="edu-degree">
                Diploma — Electrical &amp; Electronics Engineering
                <span className="edu-arrow">↗</span>
              </div>
              <div className="edu-school">TKR College of Engineering &amp; Technology · Hyderabad</div>
            </div>
          </a>

          <a
            href="https://www.srivijayasaihighschool.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-entry edu-link reveal"
          >
            <div className="edu-year">Graduated 2019</div>
            <div className="edu-info">
              <div className="edu-degree">
                SSC — 10th Standard
                <span className="edu-arrow">↗</span>
              </div>
              <div className="edu-school">Sri Vijaya Sai High School · Nizamabad, Telangana</div>
            </div>
          </a>
        </div>
        <div className="edu-globe-wrap reveal" ref={containerRef}>
          <canvas id="globe" ref={canvasRef}></canvas>
          <div className="globe-badge">
            <span className="globe-pulse"></span>
            <span>Interactive 3D Globe</span>
          </div>
          <div className="globe-hint">Click &amp; Drag to Rotate · Hover to Disturb</div>
        </div>
      </div>
    </section>
  );
};
