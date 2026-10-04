import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Disable Lenis / standard page scroll while preloader is active
    if ((window as any).__lenis) {
      (window as any).__lenis.stop();
    }
    document.body.style.overflow = 'hidden';

    const container = containerRef.current;
    if (!container) return;

    // Progress counter animation object
    const counter = { val: 0 };
    const progressEl = progressTextRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-enable scrolling when done
        if ((window as any).__lenis) {
          (window as any).__lenis.start();
        }
        document.body.style.overflow = '';
        setHidden(true);
        if (onComplete) onComplete();
      },
    });

    // 1. Initial setup
    gsap.set('.preloader-char', { y: '110%', opacity: 0, filter: 'blur(10px)' });
    gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
    gsap.set(flareRef.current, { scale: 0, opacity: 0 });
    gsap.set('.preloader-sub', { opacity: 0, y: 15, filter: 'blur(6px)' });
    gsap.set('.preloader-tag', { opacity: 0, y: -10 });
    gsap.set('.preloader-hud-corner', { opacity: 0 });

    // 2. Animate HUD markers and top badge
    tl.to('.preloader-hud-corner', {
      opacity: 0.6,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
    })
      .to(
        '.preloader-tag',
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.3'
      )

      // 3. Counter tick-up from 00 to 100
      .to(
        counter,
        {
          val: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (progressEl) {
              const num = Math.floor(counter.val);
              progressEl.textContent = `${String(num).padStart(2, '0')}%`;
            }
          },
        },
        '-=0.4'
      )

      // 4. Staggered Cinematic Name Reveal
      .to(
        '.preloader-char',
        {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.035,
          ease: 'power4.out',
        },
        '-=1.4'
      )

      // 5. Expand glowing horizon line & central flare
      .to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.8'
      )
      .to(
        flareRef.current,
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.7'
      )

      // 6. Subtitle reveal
      .to(
        '.preloader-sub',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.5'
      )

      // 7. Light shimmer sweep
      .to(
        '.preloader-shimmer',
        {
          x: '200%',
          duration: 0.85,
          ease: 'power2.inOut',
        },
        '-=0.4'
      )

      // 8. Settle pause for impact
      .to({}, { duration: 0.35 })

      // 9. Cinematic Curtain Slide & Fade Exit
      .to(
        '.preloader-content',
        {
          opacity: 0,
          y: -25,
          scale: 1.03,
          filter: 'blur(8px)',
          duration: 0.55,
          ease: 'power3.in',
        }
      )
      .to(
        container,
        {
          yPercent: -100,
          duration: 0.75,
          ease: 'expo.inOut',
        },
        '-=0.2'
      );

    // Skip on click or key press
    const handleSkip = () => {
      tl.timeScale(3);
    };

    window.addEventListener('keydown', handleSkip, { once: true });

    return () => {
      window.removeEventListener('keydown', handleSkip);
      tl.kill();
      if ((window as any).__lenis) {
        (window as any).__lenis.start();
      }
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (hidden) return null;

  const firstName = 'ALESHWARAM';
  const lastName = 'RAHUL';

  return (
    <div
      id="cinematic-preloader"
      ref={containerRef}
      className="preloader-overlay"
      aria-label="Loading portfolio"
    >
      {/* Background Aesthetic Atmosphere */}
      <div className="preloader-bg-glow" />
      <div className="preloader-grid" />

      {/* Aesthetic HUD Corner Accents */}
      <div className="preloader-hud-corner tl" />
      <div className="preloader-hud-corner tr" />
      <div className="preloader-hud-corner bl" />
      <div className="preloader-hud-corner br" />

      {/* Main Center Content */}
      <div className="preloader-content">
        {/* Top Tagline */}
        <div className="preloader-tag">
          <span className="preloader-tag-dot" />
          <span className="preloader-tag-text">SYS // INITIALIZING IDENTITY</span>
        </div>

        {/* Cinematic Name Display */}
        <div className="preloader-name-wrapper">
          <div className="preloader-name">
            <span className="preloader-word">
              {firstName.split('').map((char, i) => (
                <span key={`first-${i}`} className="preloader-char-box">
                  <span className="preloader-char">{char}</span>
                </span>
              ))}
            </span>
            <span className="preloader-space">&nbsp;</span>
            <span className="preloader-word">
              {lastName.split('').map((char, i) => (
                <span key={`last-${i}`} className="preloader-char-box">
                  <span className="preloader-char">{char}</span>
                </span>
              ))}
            </span>
          </div>

          {/* Light sweep overlay */}
          <div className="preloader-shimmer" />
        </div>

        {/* Horizon Divider Line with Center Beacon */}
        <div className="preloader-line-container">
          <div ref={lineRef} className="preloader-line" />
          <div ref={flareRef} className="preloader-flare" />
        </div>

        {/* Bottom Metadata & Counter */}
        <div className="preloader-meta">
          <span className="preloader-sub">SOFTWARE DEVELOPER &nbsp;·&nbsp; HYDERABAD</span>
          <span ref={progressTextRef} className="preloader-counter">
            00%
          </span>
        </div>
      </div>

      {/* Skip indicator */}
      <div className="preloader-skip-hint">PRESS ANY KEY TO SKIP</div>
    </div>
  );
};
