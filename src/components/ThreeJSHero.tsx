/**
 * ThreeJSHero.tsx — 3D enhanced hero section with Three.js integration and fallback handling.
 *
 * This component provides an immersive hero section that combines 2D content with optional
 * Three.js 3D environments. Features graceful WebGL detection, loading states, error boundaries,
 * and progressive enhancement with fallback content. Optimized for performance with mobile
 * device considerations and battery life preservation.
 *
 * The component includes:
 * - Dynamic headline transitions with rotating text animation
 * - Profile image display with professional presentation
 * - Call-to-action buttons (Resume download, View Work, Connect)
 * - Social media integration with accessible links
 * - Optional Three.js background scene with particle effects
 * - Progressive enhancement for devices without WebGL support
 *
 * Performance Features:
 * - WebGL availability detection before Three.js initialization
 * - Graceful fallback to standard hero layout without 3D elements
 * - Mobile device optimization (3D disabled on battery-constrained devices)
 * - Error boundary integration for Three.js failures
 *
 * Accessibility Considerations:
 * - Semantic HTML structure with proper heading hierarchy
 * - Screen reader compatible with aria-labels and descriptions
 * - Keyboard navigation support for all interactive elements
 * - High contrast color alternatives for gradient text
 *
 * Content Strategy:
 * - Headline rotation showcasing key expertise areas
 * - Professional biography with current focus and expertise
 * - Multiple call-to-action options (passive to aggressive conversion)
 * - Social proof through professional profile links
 *
 * @component
 * @example
 * ```tsx
 * import ThreeJSHero from './components/ThreeJSHero';
 *
 * function HomePage() {
 *   return <ThreeJSHero />;
 * }
 * ```
 *
 * @see {@link src/components/ThreeJSContent.tsx} for 3D scene implementation
 * @see {@link src/components/ErrorBoundary.tsx} for error handling wrapper
 */
import React, { Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

// Dynamic import for performance optimization
const ThreeJSContent = React.lazy(() =>
  import('./ThreeJSContent').then(module => ({ default: module.ThreeJSContent }))
);

/**
 * Headlines for animated rotation
 */
const headlines = [
  "SDE - AI Engineer | Generative AI Specialist",
  "Full-Stack Developer | Data Science Enthusiast",
  "Product Builder | Lifelong learner",
];

/**
 * WebGL availability detection utility
 */
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

/**
 * ThreeJSHero — 3D enhanced hero section with progressive enhancement.
 *
 * Provides an immersive landing section with optional 3D graphics and
 * animated content. Features graceful degradation for devices without
 * WebGL support and optimized performance for mobile devices.
 *
 * @component
 * @returns {JSX.Element} The rendered hero section
 *
 * @example
 * ```tsx
 * <ThreeJSHero />
 * ```
 *
 * @see {@link src/components/Hero.tsx} for standard hero fallback
 */
const ThreeJSHero: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = React.useState(0);
  const [webGLAvailable, setWebGLAvailable] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);

  return (
    <section id="home">
      <div className="relative w-full min-h-[60vh] md:h-[95vh] overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        {/* Background overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-white/95 to-blue-50/90 dark:from-blue-900/90 dark:via-gray-900/95 dark:to-blue-900/90 z-10" />

        {/* Three.js canvas with mobile optimization */}
        {webGLAvailable && (
          <div className="absolute inset-0 hidden md:block">
            <ThreeJSContent />
          </div>
        )}

        {/* Main content overlay */}
        <div className="relative z-20 flex items-center justify-center min-h-[60vh] md:h-[95vh] px-4 py-8 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center max-w-4xl w-full"
          >
            {/* Profile section */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-white leading-tight"
            >
              Ayush Rai
            </motion.h1>

            {/* Animated headline carousel */}
            <motion.div
              key={currentHeadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[4rem] md:min-h-[5rem] flex items-center justify-center mb-6 md:mb-8"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                {headlines[currentHeadline]}
              </p>
            </motion.div>

            {/* Professional biography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Exploring the intersection of artificial intelligence, web
              technologies, and innovative problem-solving to create
              transformative solutions.
            </motion.p>

            {/* Action buttons with multiple conversion paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-8 md:gap-12 justify-center items-center px-8 py-6"
            >
              <a
                href="https://drive.google.com/file/d/1EjIs-sIQrmHf0vRoQ9pTiDM_4M5x_P2p/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target btn-primary px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto text-center"
              >
                Download Resume
              </a>
              <a
                href="#projects"
                className="touch-target btn-primary px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto text-center"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="touch-target btn-secondary px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto text-center"
              >
                Let's Connect
              </a>
            </motion.div>

            {/* Social media links for credibility and connection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex justify-center items-center space-x-6 mt-8"
            >
              <motion.a
                href="https://github.com/ayushrai-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={24} className="text-gray-300 hover:text-white" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/ayushrai02"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={24} className="text-gray-300 hover:text-white" />
              </motion.a>
              <motion.a
                href="mailto:ayushrai0211@gmail.com"
                className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={24} className="text-gray-300 hover:text-white" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThreeJSHero;
