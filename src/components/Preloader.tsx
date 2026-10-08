import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

const CHARS = '0123456789ABCDEF$#@!*&%/=XYZ';
const FIRST_NAME = 'ALESHWARAM';
const LAST_NAME = 'RAHUL';

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    if ((window as any).__lenis) {
      (window as any).__lenis.stop();
    }
    document.body.style.overflow = 'hidden';

    const container = containerRef.current;
    if (!container) return;

    const charElements = Array.from(container.querySelectorAll<HTMLElement>('.decrypt-char'));
    const counterEl = counterRef.current;
    const statusEl = statusRef.current;
    const counterObj = { val: 0 };

    // Set initial scrambled characters
    charElements.forEach((el) => {
      el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      el.classList.add('scrambling');
    });

    const tl = gsap.timeline({
      onComplete: () => {
        if ((window as any).__lenis) {
          (window as any).__lenis.start();
        }
        document.body.style.overflow = '';
        setHidden(true);
      },
    });

    // 1. Initial visual setup
    gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
    gsap.set(flareRef.current, { scale: 0, opacity: 0 });
    gsap.set('.preloader-meta-top', { opacity: 0, y: -10 });
    gsap.set('.preloader-identity-wrapper', { opacity: 0, scale: 0.95 });
    gsap.set('.preloader-meta-bottom', { opacity: 0, y: 10 });
    gsap.set('.preloader-hud-corner', { opacity: 0 });

    // 2. HUD corner accents and top telemetry reveal
    tl.to('.preloader-hud-corner', {
      opacity: 0.6,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power2.out',
    })
      .to(
        ['.preloader-meta-top', '.preloader-identity-wrapper', '.preloader-meta-bottom'],
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        '-=0.15'
      )
      // 3. Expand glowing horizon line & beacon
      .to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.25'
      )
      .to(
        flareRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.25'
      )
      // 4. Scramble & Decrypt Animation synced with 00% to 100% counter
      .to(
        counterObj,
        {
          val: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            const num = Math.floor(counterObj.val);
            if (counterEl) {
              counterEl.textContent = `${String(num).padStart(2, '0')}%`;
            }

            if (statusEl) {
              if (num < 35) statusEl.textContent = 'DECRYPTING IDENTITY...';
              else if (num < 80) statusEl.textContent = 'CALIBRATING SYNAPSE...';
              else statusEl.textContent = 'IDENTITY VERIFIED // ONLINE';
            }

            // Lock in letters progressively according to percentage
            const totalChars = charElements.length;
            const threshold = (num / 100) * totalChars;

            charElements.forEach((el, idx) => {
              const target = el.getAttribute('data-final') || '';
              if (idx <= threshold) {
                if (el.textContent !== target) {
                  el.textContent = target;
                  el.classList.remove('scrambling');
                  el.classList.add('locked');
                }
              } else {
                // Keep scrambling upcoming characters
                el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
              }
            });
          },
        },
        '-=0.2'
      )
      // 5. Grand flash of completion
      .to('.preloader-identity-wrapper', {
        filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.95))',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      })
      // 6. Seamless dissolution into Hero section (ZERO blank pause)
      .call(() => {
        if (onComplete) onComplete();
      })
      .to(
        container,
        {
          opacity: 0,
          scale: 1.06,
          filter: 'blur(8px)',
          duration: 0.55,
          ease: 'power3.inOut',
        },
        '+=0.05'
      );

    // Fast skip
    const handleSkip = () => {
      tl.timeScale(4);
    };

    window.addEventListener('keydown', handleSkip, { once: true });
    container.addEventListener('click', handleSkip, { once: true });

    return () => {
      window.removeEventListener('keydown', handleSkip);
      container.removeEventListener('click', handleSkip);
      tl.kill();
      if ((window as any).__lenis) {
        (window as any).__lenis.start();
      }
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      id="cinematic-preloader"
      ref={containerRef}
      className="preloader-matrix-overlay"
      aria-label="Loading portfolio"
    >
      {/* Ambient Sci-Fi Glow & Grid */}
      <div className="preloader-bg-glow" />
      <div className="preloader-grid" />

      {/* Aesthetic HUD Corner Accents */}
      <div className="preloader-hud-corner tl" />
      <div className="preloader-hud-corner tr" />
      <div className="preloader-hud-corner bl" />
      <div className="preloader-hud-corner br" />

      {/* Main Content Center */}
      <div className="preloader-matrix-stage">
        {/* Top Header Telemetry */}
        <div className="preloader-meta-top">
          <div className="preloader-top-badge">
            <span className="badge-pulse-dot" />
            <span className="badge-title">SYS // QUANTUM IDENTITY BOOT</span>
          </div>
          <span className="preloader-top-loc">HYDERABAD, IN · 17.3850° N</span>
        </div>

        {/* Dual-Tone Kinetic Decrypt Name */}
        <div className="preloader-identity-wrapper">
          {/* First Name: Solid Heavy Luxury Typography */}
          <div className="preloader-name-row first-name-row">
            {FIRST_NAME.split('').map((char, i) => (
              <span key={`fn-${i}`} className="decrypt-char" data-final={char}>
                {char}
              </span>
            ))}
          </div>

          {/* Last Name: Framed in Cyber Brackets with Neon Stencil Glow */}
          <div className="preloader-name-row last-name-row">
            <span className="name-bracket">[</span>
            <div className="last-name-inner">
              {LAST_NAME.split('').map((char, i) => (
                <span
                  key={`ln-${i}`}
                  className="decrypt-char outline-char"
                  data-final={char}
                >
                  {char}
                </span>
              ))}
            </div>
            <span className="name-bracket">]</span>
          </div>
        </div>

        {/* Horizon Divider Line with Center Beacon */}
        <div className="preloader-line-container">
          <div ref={lineRef} className="preloader-line" />
          <div ref={flareRef} className="preloader-flare" />
        </div>

        {/* Bottom Telemetry & Real-Time Counter */}
        <div className="preloader-meta-bottom">
          <span ref={statusRef} className="preloader-status-text">
            DECRYPTING IDENTITY...
          </span>
          <div className="preloader-counter-box">
            <span className="counter-label">INDEX:</span>
            <span ref={counterRef} className="preloader-counter-num">
              00%
            </span>
          </div>
        </div>
      </div>

      {/* Skip Prompt */}
      <div className="preloader-skip-hint">CLICK OR PRESS ANY KEY TO ENTER</div>
    </div>
  );
};

export default Preloader;
