import React, { useEffect, useRef, useState } from 'react';

export const Nav: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      if (navRef.current) {
        if (scrollY > 40) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }

      if (progressRef.current) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
          progressRef.current.style.width = `${pct}%`;
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav id="nav" ref={navRef}>
        <div
          ref={progressRef}
          className="nav-scroll-progress-line"
          style={{ width: '0%' }}
        />
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); handleLinkClick('#hero'); }}>
          AR_
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Right Nav Status + Mobile Hamburger Toggle */}
        <div className="nav-right-group">
          <div className="nav-status">
            <div className="status-dot"></div>
            <span className="status-text">Available for Work</span>
          </div>

          <button
            type="button"
            className={`nav-mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop & Menu */}
      <div
        className={`nav-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        data-lenis-prevent="true"
      >
        <div className="nav-mobile-drawer-inner">
          <div className="nav-mobile-tag">DIRECTORY // NAVIGATION</div>
          <ul className="nav-mobile-links">
            <li>
              <button type="button" onClick={() => handleLinkClick('#hero')}>
                <span className="nav-num">00</span>
                <span className="nav-label">Home</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleLinkClick('#about')}>
                <span className="nav-num">01</span>
                <span className="nav-label">About</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleLinkClick('#skills')}>
                <span className="nav-num">02</span>
                <span className="nav-label">Skills</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleLinkClick('#projects')}>
                <span className="nav-num">03</span>
                <span className="nav-label">Projects</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleLinkClick('#experience')}>
                <span className="nav-num">04</span>
                <span className="nav-label">Experience</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleLinkClick('#education')}>
                <span className="nav-num">05</span>
                <span className="nav-label">Education</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleLinkClick('#contact')}>
                <span className="nav-num">06</span>
                <span className="nav-label">Contact</span>
              </button>
            </li>
          </ul>

          <div className="nav-mobile-footer">
            <div className="nav-mobile-badge">
              <span className="status-dot"></span>
              HYDERABAD, INDIA · FULL-STACK DEV
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;


