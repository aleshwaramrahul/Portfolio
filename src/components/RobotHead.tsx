import React, { useEffect, useRef } from 'react';

interface RobotHeadProps {
  size?: number;
  className?: string;
}

export const RobotHead: React.FC<RobotHeadProps> = ({ size = 76, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let targetEyeX = 0;
    let targetEyeY = 0;
    let currentEyeX = 0;
    let currentEyeY = 0;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    let isBlinking = false;
    let blinkTimeout: number;

    const scale = size / 240;

    const triggerBlink = () => {
      isBlinking = true;
      if (leftEyeRef.current) leftEyeRef.current.classList.add('blinking');
      if (rightEyeRef.current) rightEyeRef.current.classList.add('blinking');

      setTimeout(() => {
        isBlinking = false;
        if (leftEyeRef.current) leftEyeRef.current.classList.remove('blinking');
        if (rightEyeRef.current) rightEyeRef.current.classList.remove('blinking');
      }, 160);
    };

    const blinkInterval = window.setInterval(() => {
      if (!isBlinking && Math.random() > 0.2) {
        triggerBlink();
      }
    }, 3800);

    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const headCenterX = rect.left + rect.width / 2;
      const headCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - headCenterX;
      const dy = e.clientY - headCenterY;
      const dist = Math.hypot(dx, dy);

      // Angle from center of robot to cursor
      const angle = Math.atan2(dy, dx);
      // Smooth clamp distance
      const power = Math.min(dist / 220, 1);

      // Max eye travel in 240px coordinate space: 22px horizontal, 16px vertical
      const maxDistX = 22;
      const maxDistY = 16;

      targetEyeX = Math.cos(angle) * power * maxDistX;
      targetEyeY = Math.sin(angle) * power * maxDistY;

      // 3D head rotation tilt
      const winW = window.innerWidth || 1920;
      const winH = window.innerHeight || 1080;
      const normX = Math.max(-1, Math.min(1, dx / (winW * 0.4)));
      const normY = Math.max(-1, Math.min(1, dy / (winH * 0.4)));

      targetRotY = normX * 18;
      targetRotX = -normY * 16;
    };

    const handlePointerLeave = () => {
      targetEyeX = 0;
      targetEyeY = 0;
      targetRotX = 0;
      targetRotY = 0;
    };

    // Click to wink / double blink
    const handleClick = () => {
      triggerBlink();
      setTimeout(triggerBlink, 220);
    };

    const render = () => {
      // Fast & silky smooth interpolation
      currentEyeX += (targetEyeX - currentEyeX) * 0.18;
      currentEyeY += (targetEyeY - currentEyeY) * 0.18;

      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;

      if (headRef.current) {
        headRef.current.style.transform = `scale(${scale}) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      const blinkScale = isBlinking ? 'scaleY(0.06)' : 'scaleY(1)';
      const eyeTransform = `translate3d(${currentEyeX.toFixed(2)}px, ${currentEyeY.toFixed(2)}px, 0) ${blinkScale}`;
      if (leftEyeRef.current) {
        leftEyeRef.current.style.transform = eyeTransform;
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.style.transform = eyeTransform;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    containerRef.current?.addEventListener('click', handleClick);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(blinkInterval);
      clearTimeout(blinkTimeout);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`robot-head-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '800px',
        userSelect: 'none',
        cursor: 'pointer',
      }}
      title="Interactive 3D Claymorphic Robot (Click me!)"
    >
      <div
        ref={headRef}
        className="robot-head"
        style={{
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div className="robot-face">
          <div ref={leftEyeRef} className="eye" style={{ willChange: 'transform' }} />
          <div ref={rightEyeRef} className="eye" style={{ willChange: 'transform' }} />
        </div>
      </div>
    </div>
  );
};

export default RobotHead;
