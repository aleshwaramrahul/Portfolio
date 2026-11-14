import React, { useRef, useEffect, useState, useCallback } from 'react';

interface TechItem {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vRot: number;
  points: number;
  isSpecial?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

const TECH_POOL = [
  { name: 'Java', points: 10 },
  { name: 'Spring', points: 15 },
  { name: 'React', points: 10 },
  { name: 'TypeScript', points: 15 },
  { name: 'Postgres', points: 20 },
  { name: 'Supabase', points: 20 },
  { name: 'Docker', points: 25 },
  { name: 'Next.js', points: 15 },
  { name: 'Node.js', points: 15 },
  { name: 'SQL', points: 10 },
  { name: 'Git', points: 10 },
  { name: 'REST API', points: 15 },
  { name: 'BugFix', points: 30, isSpecial: true },
];

export const StackCatchGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('stack_catch_highscore') || '0', 10);
  });

  const paddleRef = useRef({ x: 300, width: 110, height: 16 });
  const itemsRef = useRef<TechItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastSpawnRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const resetGame = () => {
    setScore(0);
    setCombo(1);
    setLives(3);
    setGameOver(false);
    itemsRef.current = [];
    particlesRef.current = [];
  };

  // Continuous smooth pointer tracking directly on window so paddle never sticks/centers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      // If mouse is within or reasonably near the canvas horizontal bounds
      const canvasMouseX = ((clientX - rect.left) / rect.width) * canvas.width;
      paddleRef.current.x = Math.max(
        paddleRef.current.width / 2,
        Math.min(canvas.width - paddleRef.current.width / 2, canvasMouseX)
      );
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 50) {
        onPointerMove(e.clientX);
      }
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches[0].clientY >= rect.top - 60 && e.touches[0].clientY <= rect.bottom + 60) {
          onPointerMove(e.touches[0].clientX);
        }
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateSize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 360;
      }
    };
    updateSize();

    let isRunning = true;

    const spawnItem = (time: number) => {
      if (time - lastSpawnRef.current < 900) return;
      lastSpawnRef.current = time;

      const template = TECH_POOL[Math.floor(Math.random() * TECH_POOL.length)];
      const item: TechItem = {
        name: template.name,
        points: template.points,
        isSpecial: template.isSpecial,
        x: Math.random() * (canvas.width - 80) + 40,
        y: -20,
        vx: (Math.random() - 0.5) * 1.2,
        vy: Math.random() * 1.4 + 1.8,
        radius: 20,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.04,
      };
      itemsRef.current.push(item);
    };

    const addParticles = (x: number, y: number, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: Math.random() * 2.5 + 1.5,
        });
      }
    };

    const gameLoop = (time: number) => {
      if (!isRunning) return;

      // ── Clear Canvas (Strict Monochrome / Black #000000) ──
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle background grid wireframe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (!gameOver) {
        spawnItem(time);
      }

      // ── Update & Draw Particles (Pure White / Dimming Alpha) ──
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Update & Draw Falling Tech Items ──
      const paddle = paddleRef.current;
      const paddleY = canvas.height - 35;

      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];

        if (!gameOver) {
          item.x += item.vx;
          item.y += item.vy;
          item.rotation += item.vRot;

          // Bounce off left/right side boundaries
          if (item.x < item.radius || item.x > canvas.width - item.radius) {
            item.vx *= -1;
          }

          // Catch Collision with Paddle
          const inPaddleX =
            item.x > paddle.x - paddle.width / 2 - 8 &&
            item.x < paddle.x + paddle.width / 2 + 8;
          const hitPaddleY =
            item.y + item.radius >= paddleY &&
            item.y - item.radius <= paddleY + paddle.height;

          if (inPaddleX && hitPaddleY) {
            // Caught item!
            addParticles(item.x, paddleY, 14);
            setCombo((c) => {
              const nextCombo = c + 1;
              const pointsGained = item.points * nextCombo;
              setScore((s) => {
                const newScore = s + pointsGained;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  localStorage.setItem('stack_catch_highscore', String(newScore));
                }
                return newScore;
              });
              return nextCombo;
            });

            itemsRef.current.splice(i, 1);
            continue;
          }

          // Missed item (hit floor)
          if (item.y > canvas.height + 25) {
            itemsRef.current.splice(i, 1);
            setCombo(1);
            setLives((l) => {
              const nextLives = l - 1;
              if (nextLives <= 0) {
                setGameOver(true);
              }
              return Math.max(0, nextLives);
            });
            continue;
          }
        }

        // Draw Item Badge (Strict Monochrome: Black fill + Crisp White Stroke)
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        // Badge Pill Outline
        const pw = 58;
        const ph = 26;
        ctx.fillStyle = '#050505';
        ctx.strokeStyle = item.isSpecial ? '#ffffff' : 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = item.isSpecial ? 2 : 1.2;

        ctx.beginPath();
        ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 13);
        ctx.fill();
        ctx.stroke();

        // Inner micro dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-pw / 2 + 8, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        // Text label
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 9px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.name, 4, 0);

        ctx.restore();
      }

      // ── Draw Paddle (Crisp Cyber Magnetic Basket) ──
      ctx.save();
      const px = paddle.x - paddle.width / 2;
      const py = paddleY;

      // Magnetic beam glow between sides
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(px + 4, py + 2);
      ctx.lineTo(px + paddle.width - 4, py + 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Main Basket Bottom Base
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(px, py, paddle.width, paddle.height, 4);
      ctx.fill();
      ctx.stroke();

      // Side Magnetic Emitters
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px, py - 6, 6, 12);
      ctx.fillRect(px + paddle.width - 6, py - 6, 6, 12);

      // Paddle Center Tech Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '600 7.5px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ RECEPTOR_DOCK ]', paddle.x, py + paddle.height / 2);
      ctx.restore();

      // ── Game Over Screen ──
      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 18px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STACK OVERFLOW // GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '400 11px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`FINAL SCORE: ${score} · BEST: ${highScore}`, canvas.width / 2, canvas.height / 2 + 10);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameOver, score, highScore]);

  return (
    <div className="stack-game-container">
      {/* Game Header HUD */}
      <div className="stack-game-hud">
        <div className="stack-game-hud-left">
          <span className="stack-game-badge">STACK_CATCH v1.0</span>
          <span className="stack-game-metric">
            SCORE: <strong>{score}</strong>
          </span>
          <span className="stack-game-metric">
            COMBO: <strong>x{combo}</strong>
          </span>
          <span className="stack-game-metric">
            BEST: <strong>{highScore}</strong>
          </span>
        </div>

        <div className="stack-game-hud-right">
          <div className="stack-game-lives">
            LIVES:{' '}
            {Array.from({ length: 3 }).map((_, idx) => (
              <span
                key={idx}
                className={`stack-game-heart ${idx < lives ? 'active' : 'lost'}`}
              >
                ●
              </span>
            ))}
          </div>

          {gameOver && (
            <button className="stack-game-btn" onClick={resetGame}>
              RETRY ↺
            </button>
          )}

          <button className="stack-game-close-btn" onClick={onClose} title="Close mini-game">
            ✕ CLOSE
          </button>
        </div>
      </div>

      {/* Interactive Game Canvas */}
      <div className="stack-game-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="stack-game-canvas"
        />
        <div className="stack-game-hint">SLIDE MOUSE / TOUCH TO CATCH TECH BADGES</div>
      </div>
    </div>
  );
};
