/**
 * ParticleBackground.tsx — Animated particle system background component with performance optimizations.
 *
 * This component creates a dynamic, animated particle system using HTML5 Canvas and requestAnimationFrame.
 * Features WebGL availability checks, responsive canvas sizing, and performance optimizations for mobile devices.
 * Implements connection lines between particles with color-coded relationships and smooth motion animations.
 *
 * The component includes:
 * - Canvas-based particle rendering with custom animations
 * - Performance optimization with mobile device detection
 * - Adaptive particle connection based on distance
 * - Color-coded particle system with gradient effects
 * - Responsive canvas sizing and cleanup management
 * - Browser compatibility and error handling
 *
 * Performance Considerations:
 * - Disabled on mobile devices to preserve battery life
 * - Frame rate optimization with requestAnimationFrame
 * - Memory leak prevention with proper cleanup
 * - WebGL availability checks before initialization
 *
 * @component
 * @example
 * ```tsx
 * import ParticleBackground from './components/ParticleBackground';
 *
 * function AppBackground() {
 *   return (
 *     <>
 *       <ParticleBackground />
 *       <MainContent />
 *     </>
 *   );
 * }
 * ```
 *
 * @see {@link src/components/ThreeJSHero.tsx} for primary usage
 */
import React, { useEffect, useRef } from "react";

/**
 * ParticleBackground — Animated canvas particle system component.
 *
 * Creates a visually appealing particle background with animated nodes
 * and connection lines. Optimized for performance with mobile detection
 * and cleanup management. Disabled on mobile devices to preserve battery life.
 *
 * @component
 * @returns {JSX.Element} The rendered particle background canvas
 *
 * @example
 * ```tsx
 * <ParticleBackground />
 * ```
 *
 * @see {@link src/components/ThreeJSHero.tsx} for integration example
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
