import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Cursor } from './components/Cursor';
import { Dither } from './components/Dither';
import { FlowCanvas } from './components/FlowCanvas';
import { HalftoneTrail } from './components/HalftoneTrail';
import { HUD } from './components/HUD';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Chatbot } from './components/Chatbot';
import { Preloader } from './components/Preloader';

import { useFullpageScroll } from './hooks/useFullpageScroll';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  useFullpageScroll();

  const startHeroAnimation = () => {
    // Fast, Snappy Hero Entrance Animations triggered right after preloader reveal
    const heroTl = gsap.timeline();
    heroTl
      .to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' })
      .to('#hero-subtitle', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .to('#hero-cta', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .to('#scroll-hint', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  };

  useEffect(() => {

    // Reveal Animations on Scroll
    const triggers: ScrollTrigger[] = [];
    const elements = gsap.utils.toArray<HTMLElement>('.reveal');
    elements.forEach(el => {
      const anim = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });
      if (anim.scrollTrigger) {
        triggers.push(anim.scrollTrigger);
      }
    });

    // Refresh ScrollTrigger to recalculate accurate offsets after layout
    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 50);
    const t2 = setTimeout(refresh, 250);
    const t3 = setTimeout(refresh, 800);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      {/* Cinematic Name Reveal Preloader */}
      <Preloader onComplete={startHeroAnimation} />

      {/* Interactive Cursor */}
      <Cursor />

      {/* Background Dither Overlay */}
      <Dither />

      {/* Flow Canvas BG */}
      <FlowCanvas />

      {/* Halftone Trail Canvas */}
      <HalftoneTrail />

      {/* HUD Telemetry Data Overlays */}
      <HUD />

      {/* Navigation */}
      <Nav />

      {/* Main Page Layout */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      {/* Floating AI Chatbot Widget */}
      <Chatbot />

      {/* Footer (hidden, integrated into contact section) */}
      <footer style={{ display: 'none' }}>
        <span>Aleshwaram Rahul — Software Developer</span>
      </footer>
    </>
  );
};

export default App;
