import React, { useEffect, useRef } from 'react';

export const About: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const midRef = useRef<HTMLImageElement>(null);
  const depthRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const back = backRef.current;
    const mid = midRef.current;
    const depth = depthRef.current;
    const aboutSection = sectionRef.current;

    if (!stage || !camera || !mid || !back || !depth || !aboutSection) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let targetZoom = 0;
    let zoom = 0;

    let pointerInside = false;
    let isVisible = false;
    let isRunning = false;
    let animId: number;

    let curLx = 0;
    let curLy = 0;
    let targetLx = 0;
    let targetLy = 0;
    let currentLightAlpha = 0;
    let targetLightAlpha = 0;

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      targetZoom = 0;
      pointerInside = false;
      targetLightAlpha = 0;
      wake();
    };

    const setPointer = (clientX: number, clientY: number) => {
      if (!aboutSection || !camera) return;
      const r = aboutSection.getBoundingClientRect();
      if (
        clientX >= r.left - 40 &&
        clientX <= r.right + 40 &&
        clientY >= r.top - 40 &&
        clientY <= r.bottom + 40
      ) {
        const nx = (clientX - r.left) / r.width;
        const ny = (clientY - r.top) / r.height;

        targetX = (nx - 0.5) * 2;
        targetY = (ny - 0.5) * 2;

        const camR = camera.getBoundingClientRect();
        targetLx = clientX - camR.left;
        targetLy = clientY - camR.top;

        if (!pointerInside) {
          pointerInside = true;
          curLx = targetLx;
          curLy = targetLy;
        }
        targetLightAlpha = 1;
        wake();
      } else {
        if (pointerInside) {
          handlePointerLeave();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };
    const handleTouchEnd = () => handlePointerLeave();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) handlePointerLeave();
    });

    function wake() {
      if (isVisible && !isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(animate);
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          isVisible = e.isIntersecting;
          if (isVisible) {
            wake();
          } else {
            handlePointerLeave();
            isRunning = false;
            cancelAnimationFrame(animId);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(aboutSection);

    function animate() {
      if (!isVisible) {
        isRunning = false;
        return;
      }

      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      curLx += (targetLx - curLx) * 0.15;
      curLy += (targetLy - curLy) * 0.15;
      currentLightAlpha += (targetLightAlpha - currentLightAlpha) * 0.08;

      const rx = -y * 1.5;
      const ry = x * 2.0;

      camera.style.transform = `translate3d(${x * 6}px, ${y * 4}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      back.style.transform = `translate3d(${x * -2}px, ${y * -1.5}px, 0)`;
      mid.style.transform = `translate3d(${x * 2}px, ${y * 1.5}px, 0)`;
      depth.style.transform = `translate3d(${x * 4}px, ${y * 3}px, 0)`;

      if (currentLightAlpha > 0.005) {
        const radius = 260;
        const mask = `radial-gradient(circle ${radius}px at ${curLx.toFixed(1)}px ${curLy.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)`;
        mid.style.webkitMaskImage = mask;
        mid.style.maskImage = mask;
        mid.style.opacity = currentLightAlpha.toFixed(3);
      } else {
        mid.style.opacity = '0';
      }

      if (
        !pointerInside &&
        currentLightAlpha < 0.005 &&
        Math.abs(targetX - x) < 0.001 &&
        Math.abs(targetY - y) < 0.001
      ) {
        currentLightAlpha = 0;
        mid.style.opacity = '0';
        isRunning = false;
        return;
      }

      animId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      {/* Dynamic Cinematic Camera + Cursor Light Stage */}
      <div id="about-cinematic-stage" className="cinematic-bg" ref={stageRef}>
        <div id="about-camera" className="camera" ref={cameraRef}>
          <img id="about-back" className="layer back" src={`${import.meta.env.BASE_URL}my.png`} alt="" ref={backRef} />
          <img id="about-mid" className="layer mid" src={`${import.meta.env.BASE_URL}my.png`} alt="" ref={midRef} />
          <img id="about-depth" className="layer depth" src={`${import.meta.env.BASE_URL}my.png`} alt="" ref={depthRef} />
          <div className="vignette"></div>
          <div className="grain"></div>
        </div>
      </div>

      <div className="about-content-wrap">
        <div className="section-label reveal">01 / About</div>
        <h2 className="section-title reveal">
          <span className="title-solid">DEVELOPER</span>{' '}
          <span className="title-outline">PROFILE</span>
        </h2>
        <div className="about-grid">
          <div className="about-portrait-wrap reveal">
            <div className="portrait-bg-glow"></div>
            
            {/* Top-Left Crosshair & Vertical Title */}
            <div className="hud-corner-tl">
              <span className="hud-crosshair">+</span>
              <span className="hud-vert-label">SOFTWARE DEVELOPER</span>
            </div>

            {/* Top-Right Slits */}
            <div className="hud-corner-tr">
              <div className="hud-slits">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            {/* Halftone Portrait */}
            <img src={`${import.meta.env.BASE_URL}portrait-halftone.png`} alt="Aleshwaram Rahul Portrait" className="portrait-img" />

            {/* Bottom-Left Quote & Arrow */}
            <div className="hud-bottom-quote">
              <div className="quote-lines">
                <span>BUILDING</span>
                <span>IDEAS INTO</span>
                <span className="quote-action">REAL SOLUTIONS <span className="quote-arrow">→</span></span>
              </div>
            </div>

            {/* Cybernetic HUD Frame Border & Chamfer */}
            <div className="portrait-hud-frame"></div>
          </div>
          <div className="about-text">
            <div className="about-badge reveal">
              <span className="about-badge-dot"></span>
              HELLO, I'M RAHUL
            </div>
            
            <h3 className="about-hero-title reveal">
              Software <span className="title-accent">Developer</span>
            </h3>

            <p className="about-lead reveal">
              Specializing in <strong>Java</strong>, <strong>Spring Boot</strong>, <strong>React</strong>, and <strong>RESTful application development</strong>.
            </p>

            <p className="reveal">
              I build full-stack applications, backend services, and responsive user interfaces, working with <strong>Java</strong>, <strong>Spring Boot</strong>, <strong>React</strong>, <strong>SQL</strong>, and relational databases.
            </p>
            
            <p className="reveal">
              With a strong foundation in <strong>OOP</strong>, <strong>Data Structures & Algorithms</strong>, and backend development, I focus on writing clean, practical, and scalable solutions.
            </p>

            <div className="about-tech-stack reveal">
              <div className="tech-stack-heading">TECH STACK</div>
              <div className="tech-stack-grid">
                <div className="tech-stack-card">
                  <img src={`${import.meta.env.BASE_URL}about-cards/1.png`} alt="Tech Stack 1" />
                </div>
                <div className="tech-stack-card">
                  <img src={`${import.meta.env.BASE_URL}about-cards/2.png`} alt="Tech Stack 2" />
                </div>
                <div className="tech-stack-card">
                  <img src={`${import.meta.env.BASE_URL}about-cards/3.png`} alt="Tech Stack 3" />
                </div>
                <div className="tech-stack-card">
                  <img src={`${import.meta.env.BASE_URL}about-cards/4.png`} alt="Tech Stack 4" />
                </div>
                <div className="tech-stack-card">
                  <img src={`${import.meta.env.BASE_URL}about-cards/5.png`} alt="Tech Stack 5" />
                </div>
                <div className="tech-stack-card">
                  <img src={`${import.meta.env.BASE_URL}about-cards/6.png`} alt="Tech Stack 6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
