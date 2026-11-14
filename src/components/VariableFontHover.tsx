import React, { useRef, useMemo, useEffect } from 'react';
import { gsap } from 'gsap';

type StaggerFrom = 'first' | 'last' | 'center' | 'random';

interface VariableHoverWordProps {
  text: string;
  className?: string;
  fromWeight?: number;
  toWeight?: number;
  staggerDuration?: number; // ms
  staggerFrom?: StaggerFrom;
  style?: React.CSSProperties;
}

export const VariableFontHoverWord: React.FC<VariableHoverWordProps> = ({
  text,
  className = '',
  fromWeight = 400,
  toWeight = 900,
  staggerDuration = 35,
  staggerFrom = 'first',
  style,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const letters = useMemo(() => text.split(''), [text]);

  const staggerSec = Math.max(0, staggerDuration) / 1000;

  // Stagger distribution calculator matching Originkit / Framer Motion
  const getDelay = (index: number, total: number): number => {
    if (staggerFrom === 'last') {
      return (total - 1 - index) * staggerSec;
    }
    if (staggerFrom === 'center') {
      const mid = (total - 1) / 2;
      return Math.abs(index - mid) * staggerSec;
    }
    if (staggerFrom === 'random') {
      // Deterministic pseudo-random based on letter index so it's consistent
      const pseudo = Math.sin(index * 9999) - Math.floor(Math.sin(index * 9999));
      return pseudo * (total * staggerSec);
    }
    // Default 'first'
    return index * staggerSec;
  };

  const handleMouseEnter = () => {
    const validLetters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const total = validLetters.length;

    validLetters.forEach((el, i) => {
      const delay = getDelay(i, total);
      gsap.to(el, {
        fontWeight: toWeight,
        fontVariationSettings: `'wght' ${toWeight}`,
        duration: 0.55,
        delay,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  };

  const handleMouseLeave = () => {
    const validLetters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const total = validLetters.length;

    validLetters.forEach((el, i) => {
      const delay = getDelay(i, total);
      gsap.to(el, {
        fontWeight: fromWeight,
        fontVariationSettings: `'wght' ${fromWeight}`,
        duration: 0.65,
        delay,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  };

  // Reset letter references on re-render
  lettersRef.current = [];

  return (
    <span
      ref={containerRef}
      className={`variable-hover-word ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        cursor: 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Visually hidden screen reader label */}
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {text}
      </span>

      {letters.map((letter, i) => (
        <span
          key={i}
          ref={(el) => {
            lettersRef.current[i] = el;
          }}
          aria-hidden
          className="variable-hover-letter"
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
            fontWeight: fromWeight,
            fontVariationSettings: `'wght' ${fromWeight}`,
            fontFamily: "'Barlow Condensed', 'Bebas Neue', sans-serif",
            transition: 'color 0.2s ease, -webkit-text-stroke 0.2s ease',
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};
