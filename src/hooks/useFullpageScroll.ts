import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useFullpageScroll = () => {
  useEffect(() => {
    // 1. Studio-grade Lenis instance with velocity tracking
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    (window as any).__lenis = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 3. Ensure headings remain completely static and never skewed/moved during scroll
    const titleElements = document.querySelectorAll<HTMLElement>('.section-title, .hero-title-fallback, .contact-big');
    titleElements.forEach((el) => {
      el.style.transform = '';
    });

    // 4. Cached DOM Nodes for zero layout thrashing
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a'));
    const hudNode = document.querySelector('#hud-tl .hud-line:nth-child(2)');
    let lastActiveSector = '';

    const updateActiveSector = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.38;
      let activeId = 'hero';

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        if (scrollY >= sectionElements[i].offsetTop) {
          activeId = sectionElements[i].id;
          break;
        }
      }

      if (activeId !== lastActiveSector) {
        lastActiveSector = activeId;
        for (let i = 0; i < navLinks.length; i++) {
          const href = navLinks[i].getAttribute('href')?.replace('#', '');
          if (href === activeId) {
            navLinks[i].classList.add('active');
          } else {
            navLinks[i].classList.remove('active');
          }
        }
        if (hudNode) {
          hudNode.textContent = `SECTOR // ${activeId.toUpperCase()}`;
        }
      }
    };

    const onScroll = (e: any) => {
      const vel = e.velocity || 0;
      (window as any).__scrollVelocity = vel;
      updateActiveSector();
    };

    lenis.on('scroll', onScroll);
    updateActiveSector();

    // 5. Parallax Scrub on Hero, Cards & Backgrounds (Non-heading elements only)
    const ctx = gsap.context(() => {
      gsap.to('#hero-name-container', {
        y: -75,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      const skillCards = gsap.utils.toArray<HTMLElement>('.skill-card');
      skillCards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 25 + (idx % 3) * 12, opacity: 0.9 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#skills',
              start: 'top 82%',
              end: 'top 32%',
              scrub: 1.1,
            },
          }
        );
      });

      gsap.fromTo(
        '.project-inspector-card',
        { y: 35, rotateX: 4, opacity: 0.85 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      );
    });

    // 6. Section Label Matrix Hacker Decode on Scroll
    const CHARS = '0123456789ABCDEF_//#!$*';
    const sectionLabels = Array.from(document.querySelectorAll<HTMLElement>('.section-label'));
    const decodedSet = new WeakSet<HTMLElement>();

    const runMatrixDecode = (el: HTMLElement) => {
      if (decodedSet.has(el)) return;
      decodedSet.add(el);

      const originalText = el.getAttribute('data-text') || el.innerText;
      el.setAttribute('data-text', originalText);
      let iteration = 0;
      const maxIterations = originalText.length * 2;

      const interval = setInterval(() => {
        el.innerText = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration / 2 || char === ' ' || char === '/') {
              return originalText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');

        if (iteration >= maxIterations) {
          el.innerText = originalText;
          clearInterval(interval);
        }
        iteration += 1;
      }, 25);
    };

    const labelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runMatrixDecode(entry.target as HTMLElement);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionLabels.forEach((el) => labelObserver.observe(el));

    // 7. Smooth Anchor Clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
              window.history.replaceState(null, '', href);
              updateActiveSector();
            },
          });
        }
      }
    };

    // 8. Keyboard Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;
      if (sectionElements.length === 0) return;

      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let currentIndex = 0;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        if (scrollY >= sectionElements[i].offsetTop) {
          currentIndex = i;
          break;
        }
      }

      let targetIndex = currentIndex;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        targetIndex = Math.min(sectionElements.length - 1, currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        targetIndex = Math.max(0, currentIndex - 1);
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = sectionElements.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      lenis.scrollTo(sectionElements[targetIndex], {
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleAnchorClick);

    // Refresh ScrollTrigger
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      lenis.destroy();
      ctx.revert();
      gsap.ticker.remove(tickerCallback);
      labelObserver.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};

export default useFullpageScroll;
