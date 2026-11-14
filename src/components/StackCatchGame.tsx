import React, { useRef, useEffect, useState } from 'react';

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
  
  // UI Display states
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [displayCatches, setDisplayCatches] = useState(0);
  const [targetCatches, setTargetCatches] = useState(10);
  const [displayCombo, setDisplayCombo] = useState(1);
  const [displayLives, setDisplayLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [levelUpText, setLevelUpText] = useState<string | null>(null);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('stack_catch_highscore') || '0', 10);
  });

  // Mutable Game State Refs (Zero canvas destruction / zero resets on state change)
  const gameStateRef = useRef({
    score: 0,
    combo: 1,
    lives: 3,
    level: 1,
    totalCatches: 0,
    currentLevelCatches: 0,
    catchesForNextLevel: 10, // Level 1 = 10, Level 2 = 20, Level 3 = 30...
    speedMultiplier: 1.0,
    spawnInterval: 1200, // Starts relaxed and speeds up per level
    gameOver: false,
    levelBannerTimer: 0,
    highScore: parseInt(localStorage.getItem('stack_catch_highscore') || '0', 10),
  });

  const paddleRef = useRef({ x: 300, width: 120, height: 16 });
  const itemsRef = useRef<TechItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastSpawnRef = useRef(0);

  const resetGame = () => {
    gameStateRef.current.score = 0;
    gameStateRef.current.combo = 1;
    gameStateRef.current.lives = 3;
    gameStateRef.current.level = 1;
    gameStateRef.current.totalCatches = 0;
    gameStateRef.current.currentLevelCatches = 0;
    gameStateRef.current.catchesForNextLevel = 10;
    gameStateRef.current.speedMultiplier = 1.0;
    gameStateRef.current.spawnInterval = 1200;
    gameStateRef.current.gameOver = false;
    gameStateRef.current.levelBannerTimer = 0;
    itemsRef.current = [];
    particlesRef.current = [];

    paddleRef.current.width = 120; // reset paddle size
    setDisplayScore(0);
    setDisplayLevel(1);
    setDisplayCatches(0);
    setTargetCatches(10);
    setDisplayCombo(1);
    setDisplayLives(3);
    setIsGameOver(false);
    setLevelUpText(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 360;
        if (!paddleRef.current.x || paddleRef.current.x <= 0) {
          paddleRef.current.x = canvas.width / 2;
        }
      }
    };
    resizeCanvas();

    let animId: number;
    let isRunning = true;

    // Direct pointer tracking on window & canvas
    const updatePointerX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = ((clientX - rect.left) / rect.width) * canvas.width;
      paddleRef.current.x = Math.max(
        paddleRef.current.width / 2,
        Math.min(canvas.width - paddleRef.current.width / 2, canvasX)
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top - 80 && e.clientY <= rect.bottom + 80) {
        updatePointerX(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches[0].clientY >= rect.top - 80 && e.touches[0].clientY <= rect.bottom + 80) {
          updatePointerX(e.touches[0].clientX);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    const spawnItem = (time: number) => {
      const state = gameStateRef.current;
      if (time - lastSpawnRef.current < state.spawnInterval) return;
      lastSpawnRef.current = time;

      const template = TECH_POOL[Math.floor(Math.random() * TECH_POOL.length)];
      
      // Speed scales progressively with level
      const baseVy = (Math.random() * 0.8 + 1.2) * state.speedMultiplier;
      const baseVx = (Math.random() - 0.5) * (0.8 * state.speedMultiplier);

      const item: TechItem = {
        name: template.name,
        points: template.points * state.level,
        isSpecial: template.isSpecial,
        x: Math.random() * (canvas.width - 90) + 45,
        y: -20,
        vx: baseVx,
        vy: baseVy,
        radius: 20,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.03 * state.speedMultiplier,
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

      const state = gameStateRef.current;

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

      if (!state.gameOver) {
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

        if (!state.gameOver) {
          item.x += item.vx;
          item.y += item.vy;
          item.rotation += item.vRot;

          // Bounce off left/right side boundaries
          if (item.x < item.radius || item.x > canvas.width - item.radius) {
            item.vx *= -1;
          }

          // Catch Collision with Paddle
          const inPaddleX =
            item.x > paddle.x - paddle.width / 2 - 10 &&
            item.x < paddle.x + paddle.width / 2 + 10;
          const hitPaddleY =
            item.y + item.radius >= paddleY &&
            item.y - item.radius <= paddleY + paddle.height + 4;

          if (inPaddleX && hitPaddleY) {
            // Caught item!
            addParticles(item.x, paddleY, 14);

            state.combo += 1;
            state.totalCatches += 1;
            state.currentLevelCatches += 1;

            const pointsGained = item.points * state.combo;
            state.score += pointsGained;

            // Check Level Progression (Catch 10 in Level 1, 20 in Level 2, 30 in Level 3...)
            if (state.currentLevelCatches >= state.catchesForNextLevel) {
              state.level += 1;
              state.currentLevelCatches = 0;
              state.catchesForNextLevel = state.level * 10;
              state.speedMultiplier += 0.28; // Speed gently increases
              state.spawnInterval = Math.max(550, 1200 - state.level * 120); // Faster spawn
              
              // Paddle gets slightly more challenging/sleeker
              paddle.width = Math.max(76, 120 - (state.level - 1) * 8);

              // Level up celebratory particles
              addParticles(canvas.width / 2, canvas.height / 2, 28);
              state.levelBannerTimer = 90; // Display for ~1.5 seconds
              setLevelUpText(`LEVEL ${state.level} UNLOCKED // SPEED UP!`);
              setTimeout(() => setLevelUpText(null), 1800);

              setDisplayLevel(state.level);
              setTargetCatches(state.catchesForNextLevel);
            }

            if (state.score > state.highScore) {
              state.highScore = state.score;
              localStorage.setItem('stack_catch_highscore', String(state.score));
              setHighScore(state.score);
            }

            setDisplayScore(state.score);
            setDisplayCombo(state.combo);
            setDisplayCatches(state.currentLevelCatches);

            itemsRef.current.splice(i, 1);
            continue;
          }

          // Missed item (hit floor)
          if (item.y > canvas.height + 25) {
            itemsRef.current.splice(i, 1);
            state.combo = 1;
            state.lives -= 1;

            setDisplayCombo(1);
            setDisplayLives(Math.max(0, state.lives));

            if (state.lives <= 0) {
              state.gameOver = true;
              setIsGameOver(true);
            }
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

      // ── Draw Paddle (Crisp Cyber Magnetic Basket at EXACT paddle.x) ──
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
      ctx.font = '600 7px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ RECEPTOR_DOCK ]', paddle.x, py + paddle.height / 2);
      ctx.restore();

      // ── Level Up In-Game HUD Splash ──
      if (state.levelBannerTimer > 0) {
        state.levelBannerTimer -= 1;
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 16px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`⚡ LEVEL ${state.level} ⚡`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '400 10px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`CATCH ${state.catchesForNextLevel} BADGES TO ADVANCE`, canvas.width / 2, canvas.height / 2 + 14);
        ctx.restore();
      }

      // ── Game Over Screen ──
      if (state.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 18px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STACK OVERFLOW // GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '400 11px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(
          `SCORE: ${state.score} · LEVEL: ${state.level} · BEST: ${state.highScore}`,
          canvas.width / 2,
          canvas.height / 2 + 10
        );
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="stack-game-container">
      {/* Game Header HUD */}
      <div className="stack-game-hud">
        <div className="stack-game-hud-left">
          <span className="stack-game-badge">LVL {displayLevel}</span>

          <span className="stack-game-metric">
            GOAL: <strong>{displayCatches} / {targetCatches}</strong>
          </span>

          <span className="stack-game-metric">
            SCORE: <strong>{displayScore}</strong>
          </span>

          <span className="stack-game-metric">
            COMBO: <strong>x{displayCombo}</strong>
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
                className={`stack-game-heart ${idx < displayLives ? 'active' : 'lost'}`}
              >
                ●
              </span>
            ))}
          </div>

          {isGameOver && (
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
        <canvas ref={canvasRef} className="stack-game-canvas" />
        
        {levelUpText && (
          <div className="stack-game-level-up-toast">
            {levelUpText}
          </div>
        )}

        <div className="stack-game-hint">
          LEVEL {displayLevel} · CATCH {displayCatches}/{targetCatches} TO LEVEL UP
        </div>
      </div>
    </div>
  );
};
