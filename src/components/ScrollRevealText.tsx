import React, { useEffect, useRef, useState, useMemo } from 'react';
import './ScrollRevealText.css';

export interface ScrollRevealTextProps {
  /** The full sentence to reveal on scroll */
  text?: string;
  /** Words or phrases that should have the subtle purple accent color */
  highlightWords?: string[];
  /** Height of the scroll container to control the duration/speed of the reveal */
  containerHeight?: string;
  /** Custom class for styling extensions */
  className?: string;
}

interface CharData {
  char: string;
  globalIndex: number;
  isHighlight: boolean;
}

interface WordData {
  word: string;
  isHighlight: boolean;
  chars: CharData[];
  spaceGlobalIndex?: number;
}

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text = 'We create digital experiences through animation',
  highlightWords = ['animation'],
  containerHeight = '300vh',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Parse words, characters, and their global sequential indices
  const { wordsData, totalChars } = useMemo(() => {
    const rawWords = text.trim().split(/\s+/);
    let globalIndex = 0;

    const lowerHighlights = highlightWords.map((w) =>
      w.toLowerCase().replace(/[^a-z0-9]/gi, '')
    );

    const words: WordData[] = rawWords.map((word, wIdx) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
      const isHighlight = lowerHighlights.includes(cleanWord);

      const chars: CharData[] = [];
      for (let i = 0; i < word.length; i++) {
        chars.push({
          char: word[i],
          globalIndex: globalIndex++,
          isHighlight,
        });
      }

      let spaceGlobalIndex: number | undefined = undefined;
      if (wIdx < rawWords.length - 1) {
        spaceGlobalIndex = globalIndex++;
      }

      return {
        word,
        isHighlight,
        chars,
        spaceGlobalIndex,
      };
    });

    return { wordsData: words, totalChars: globalIndex };
  }, [text, highlightWords]);

  useEffect(() => {
    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    let isRunning = false;

    const calculateTargetProgress = () => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return 1;

      // When the top of container meets top of viewport, rect.top is 0
      const scrolled = -rect.top;
      const rawProgress = scrolled / totalScrollable;
      return Math.min(Math.max(rawProgress, 0), 1);
    };

    const updateLoop = () => {
      // Smooth linear interpolation for buttery cinematic feel
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.14; // Smooth spring/lerp factor
        setProgress(currentProgress);
        animationFrameId = requestAnimationFrame(updateLoop);
      } else {
        currentProgress = targetProgress;
        setProgress(currentProgress);
        isRunning = false;
      }
    };

    const handleScrollOrResize = () => {
      targetProgress = calculateTargetProgress();
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(updateLoop);
      }
    };

    // Initial evaluation
    targetProgress = calculateTargetProgress();
    currentProgress = targetProgress;
    setProgress(currentProgress);

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Number of characters currently visible based on scroll progress
  const visibleCount = Math.round(progress * totalChars);

  return (
    <section
      ref={containerRef}
      className={`scroll-reveal-container ${className}`}
      style={{ height: containerHeight }}
      aria-label="Scroll reveal section"
    >
      <div className="scroll-reveal-sticky">
        <h2 className="scroll-reveal-heading">
          {/* If at 0% scroll, place cursor right at the beginning */}
          {visibleCount === 0 && <span className="scroll-reveal-cursor" aria-hidden="true" />}

          {wordsData.map((wordData, wIdx) => {
            return (
              <span key={`word-${wIdx}`} className="scroll-reveal-word">
                {wordData.chars.map((charData) => {
                  const isRevealed = charData.globalIndex < visibleCount;
                  const isCursorHere = charData.globalIndex === visibleCount - 1;

                  return (
                    <React.Fragment key={`char-${charData.globalIndex}`}>
                      <span
                        className={`scroll-reveal-char ${
                          isRevealed ? 'is-revealed' : 'is-hidden'
                        } ${charData.isHighlight ? 'is-highlight' : ''}`}
                      >
                        {charData.char}
                      </span>
                      {isCursorHere && (
                        <span className="scroll-reveal-cursor" aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Space between words */}
                {wordData.spaceGlobalIndex !== undefined && (
                  <React.Fragment key={`space-${wordData.spaceGlobalIndex}`}>
                    <span className="scroll-reveal-space">&nbsp;</span>
                    {wordData.spaceGlobalIndex === visibleCount - 1 && (
                      <span className="scroll-reveal-cursor" aria-hidden="true" />
                    )}
                  </React.Fragment>
                )}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
};

export default ScrollRevealText;
