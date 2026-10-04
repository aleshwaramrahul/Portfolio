import React, { useEffect, useRef } from 'react';

export const HalftoneTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const VERT = `attribute vec2 position; varying vec2 vUv;
      void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }`;
    const TRAIL_FRAG = `precision mediump float;
      uniform sampler2D uPrevTrail; uniform vec2 uMouse; uniform vec2 uMouseDir;
      uniform float uVelocity, uDecay, uBrushSize, uAspect, uReveal;
      varying vec2 vUv;
      void main() {
        // Multiplicative decay with epsilon subtraction ensures 100% clean fade without ghost traces
        float prev = max(0.0, texture2D(uPrevTrail, vUv).r * uDecay - 0.008);
        vec2 delta = vUv - uMouse; delta.x *= uAspect;
        vec2 dir = length(uMouseDir) > 0.001 ? uMouseDir : vec2(0.0, 1.0);
        float along = dot(delta, dir); float perp = length(delta - along * dir);
        float elong = 1.0 + uVelocity * 2.0;
        float bd = sqrt(along*along/elong + perp*perp);
        float blob = exp(-bd*bd/(uBrushSize*uBrushSize)) * uReveal;
        gl_FragColor = vec4(min(prev+blob,1.0),0.0,0.0,1.0);
      }`;
    const HALFTONE_FRAG = `#extension GL_OES_standard_derivatives : enable
      precision mediump float;
      uniform sampler2D uTrailTexture; uniform vec2 uResolution;
      uniform float uCellSize; uniform vec3 uColor; uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec2 pixel = vUv * uResolution;
        vec2 cellCoord = floor(pixel / uCellSize);
        vec2 cellCenter = (cellCoord + 0.5) * uCellSize;
        vec2 ccUv = cellCenter / uResolution;
        float density = texture2D(uTrailTexture, ccUv).r;
        if (density < 0.04) discard;
        float dist = length(fract(pixel / uCellSize) - 0.5);
        float radius = density * 0.47;
        float aa = fwidth(dist);
        float inDot = 1.0 - smoothstep(radius - aa, radius, dist);
        if (inDot <= 0.0) discard;
        float alpha = inDot * smoothstep(0.06, 0.22, density);
        gl_FragColor = vec4(uColor, alpha * uOpacity);
      }`;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    gl.getExtension('OES_standard_derivatives');

    function compileShader(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    function linkProg(vs: string, fs: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, compileShader(vs, gl!.VERTEX_SHADER));
      gl!.attachShader(p, compileShader(fs, gl!.FRAGMENT_SHADER));
      gl!.linkProgram(p);
      return p;
    }
    function createFBO(w: number, h: number) {
      const tex = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      const fb = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
      return { fb, tex };
    }

    const trailProg = linkProg(VERT, TRAIL_FRAG);
    const hProg = linkProg(VERT, HALFTONE_FRAG);

    const tPos = gl.getAttribLocation(trailProg, 'position');
    const uPrevTrail = gl.getUniformLocation(trailProg, 'uPrevTrail');
    const uMouse = gl.getUniformLocation(trailProg, 'uMouse');
    const uMouseDir = gl.getUniformLocation(trailProg, 'uMouseDir');
    const uVelocity = gl.getUniformLocation(trailProg, 'uVelocity');
    const uDecay = gl.getUniformLocation(trailProg, 'uDecay');
    const uBrushSize = gl.getUniformLocation(trailProg, 'uBrushSize');
    const uAspect = gl.getUniformLocation(trailProg, 'uAspect');
    const uReveal = gl.getUniformLocation(trailProg, 'uReveal');

    const hPos = gl.getAttribLocation(hProg, 'position');
    const uTrailTexture = gl.getUniformLocation(hProg, 'uTrailTexture');
    const uResolution = gl.getUniformLocation(hProg, 'uResolution');
    const uCellSize = gl.getUniformLocation(hProg, 'uCellSize');
    const uColor = gl.getUniformLocation(hProg, 'uColor');
    const uOpacity = gl.getUniformLocation(hProg, 'uOpacity');

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

    let fboA = createFBO(256, 256);
    let fboB = createFBO(256, 256);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboA.fb); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fb); gl.clear(gl.COLOR_BUFFER_BIT);

    let cW = window.innerWidth, cH = window.innerHeight;
    let mouseX = -9999, mouseY = -9999, prevX = -9999, prevY = -9999;
    let dirX = 0, dirY = 1, velocity = 0, reveal = 0;
    let activeFrames = 60;
    let isRunning = false;
    let animId: number;

    const clearAllFBOs = () => {
      if (!gl) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboA.fb);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fb);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    function resize() {
      if (!canvas) return;
      cW = window.innerWidth; cH = window.innerHeight;
      canvas.width = cW; canvas.height = cH;
      canvas.style.width = cW + 'px'; canvas.style.height = cH + 'px';
      wake();
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    function wake() {
      activeFrames = 60;
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(tick);
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      prevX = mouseX === -9999 ? e.clientX / cW : mouseX;
      prevY = mouseY === -9999 ? 1.0 - e.clientY / cH : mouseY;
      mouseX = e.clientX / cW;
      mouseY = 1.0 - e.clientY / cH;
      const aspect = cW / cH;
      const dx = (mouseX - prevX) * aspect;
      const dy = mouseY - prevY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      velocity = Math.min(35 * dist, 1.0);
      if (dist > 1e-4) { dirX = dx/dist; dirY = dy/dist; }
      reveal = 1.0;
      wake();
    };

    const handleMouseLeave = () => {
      reveal = 0;
      velocity = 0;
      mouseX = -9999;
      mouseY = -9999;
      prevX = -9999;
      prevY = -9999;
      clearAllFBOs();
      activeFrames = 0;
      isRunning = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) handleMouseLeave();
    });
    window.addEventListener('blur', handleMouseLeave);

    function tick() {
      if (activeFrames <= 0) {
        clearAllFBOs();
        isRunning = false;
        return;
      }
      activeFrames--;

      reveal += (0 - reveal) * 0.12;
      velocity *= 0.82;

      // Pass 1: Trail Update
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fboB.fb);
      gl!.viewport(0, 0, 256, 256);
      gl!.useProgram(trailProg);
      gl!.enableVertexAttribArray(tPos);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.vertexAttribPointer(tPos, 2, gl!.FLOAT, false, 0, 0);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, fboA.tex);
      gl!.uniform1i(uPrevTrail, 0);
      gl!.uniform2f(uMouse, mouseX, mouseY);
      gl!.uniform2f(uMouseDir, dirX, dirY);
      gl!.uniform1f(uVelocity, velocity);
      gl!.uniform1f(uDecay, 0.92);
      gl!.uniform1f(uBrushSize, 0.028);
      gl!.uniform1f(uAspect, cW / cH);
      gl!.uniform1f(uReveal, reveal);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);

      const tmp = fboA; fboA = fboB; fboB = tmp;

      // Pass 2: Halftone Screen Render
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.useProgram(hProg);
      gl!.enableVertexAttribArray(hPos);
      gl!.vertexAttribPointer(hPos, 2, gl!.FLOAT, false, 0, 0);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, fboA.tex);
      gl!.uniform1i(uTrailTexture, 0);
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform1f(uCellSize, 7);
      gl!.uniform3f(uColor, 1, 1, 1);
      gl!.uniform1f(uOpacity, 0.7);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.clearColor(0,0,0,0); gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
    };
  }, []);

  return <canvas id="halftone-canvas" ref={canvasRef}></canvas>;
};
