/**
 * Legacy full-screen 2D canvas background of drifting particles joined by faint lines.
 *
 * Legacy: not imported anywhere in src/ (ThreeJSHero does not use it). Kept for
 * reference; src/components/backgrounds is excluded from tsconfig.app.json.
 * Covered only by src/__tests__/legacy/ParticleBackground.test.tsx, which Vitest excludes.
 *
 * On mount it sizes a fixed canvas to the window, seeds 80 particles, and runs a
 * requestAnimationFrame loop that moves them (wrapping at the edges) and draws a
 * line between every pair closer than 150px, an O(n^2) pass per frame. It uses
 * the 2D context only: there is no WebGL check and no mobile detection.
 *
 * Connects to:
 * - No importers in src/
 * - Browser Canvas 2D API; src/setupTests.ts stubs getContext for jsdom
 */
import React, { useEffect, useRef } from "react";

/**
 * Renders a non-interactive `<canvas data-testid="particle-canvas">` behind page content.
 *
 * The effect cleanup removes the resize listener but never cancels the
 * animation frame, so the draw loop keeps running after unmount.
 */
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /** Matches the canvas drawing buffer to the window size; also bound to `resize`. */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ["#00D9FF", "#39FF14", "#6B46C1", "#9333EA"];
    const particleCount = 80;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    /** One frame: clear, move and draw each particle, draw near-neighbour lines, then schedule the next frame. */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              const opacity = ((150 - distance) / 150) * 0.2;
              ctx.strokeStyle = `#00D9FF${Math.floor(opacity * 255)
                .toString(16)
                .padStart(2, "0")}`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="particle-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default ParticleBackground;
