import React, { useEffect, useRef } from 'react';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId: number;
    let isVisible = false;

    let isRunning = false;

    // Initially hide until first mouse interaction
    dot.style.opacity = '0';
    ring.style.opacity = '0';

    const wake = () => {
      if (!isRunning && isVisible) {
        isRunning = true;
        animId = requestAnimationFrame(renderRing);
      }
    };

    const showCursor = () => {
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        wake();
      }
    };

    const hideCursor = () => {
      isVisible = false;
      isRunning = false;
      cancelAnimationFrame(animId);
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      showCursor();
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      wake();
    };

    const renderRing = () => {
      if (!isVisible) {
        isRunning = false;
        return;
      }
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.18;
      ringY += dy * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        animId = requestAnimationFrame(renderRing);
      } else {
        isRunning = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Hide when mouse exits window / screen boundaries
    const handleMouseLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        hideCursor();
      }
    };

    const handleDocMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        hideCursor();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleDocMouseOut);
    document.addEventListener('mouseenter', showCursor);
    window.addEventListener('blur', hideCursor);

    // High performance event delegation for hover states
    const interactiveSelector = 'a, button, input, textarea, .project-tab-btn, .tech-tag-pill, .project-btn-view, .project-btn-repo, .project-card, .skill-card, .exp-entry, .hud-data, .exp-nav-item, .contact-link, .btn, .edu-globe-wrap, .chatbot-trigger-btn, .chatbot-close-btn, .chatbot-chip-link, .chatbot-suggestion-pill, .chatbot-send-btn, .chatbot-input';

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseout', handleDocMouseOut);
      document.removeEventListener('mouseenter', showCursor);
      window.removeEventListener('blur', hideCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
};
