/**
 * Legacy landing hero with a rotating headline, three CTA links, social icons, and an optional Three.js background.
 *
 * Legacy: not imported anywhere in src/ (the current "/" is src/pages/HomePage.tsx).
 * Kept for reference; src/components/backgrounds is excluded from
 * tsconfig.app.json. Covered only by src/__tests__/legacy/ThreeJSHero.test.tsx,
 * which Vitest excludes.
 *
 * The 3D scene is lazy-loaded and shown only when WebGL is detected; on small
 * screens it is hidden with CSS (`hidden md:block`) but still mounted. There is
 * no Suspense boundary around the lazy component and no error boundary, so
 * rendering this outside a parent <Suspense> throws while the chunk loads.
 * There is no profile image, and the icon-only social links have no aria-label.
 *
 * Connects to:
 * - No importers in src/
 * - ./ThreeJSContent (src/components/backgrounds/ThreeJSContent.tsx) via React.lazy
 * - framer-motion, lucide-react
 */
import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

/** Lazy wrapper that maps the module's named `ThreeJSContent` export to the default export React.lazy expects. */
const ThreeJSContent = React.lazy(() =>
  import('./ThreeJSContent').then(module => ({ default: module.ThreeJSContent }))
);

/** Lines cycled under the name every 3 seconds. */
const headlines = [
  "SDE - AI Engineer | Generative AI Specialist",
  "Full-Stack Developer | Data Science Enthusiast",
  "Product Builder | Lifelong learner",
];

/** Returns true if a webgl or experimental-webgl context can be created (duplicated inside ThreeJSContent.tsx). */
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
};

/**
 * Renders `<section id="home">`. `webGLAvailable` starts true and is corrected
 * after mount, so the lazy scene is requested on the first render regardless.
 * The `#projects` and `#contact` links rely on legacy sections being on the same page.
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
      <div className="relative w-full min-h-[50vh] md:h-[85vh] overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        {/* Background overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-white/95 to-blue-50/90 dark:from-blue-900/90 dark:via-gray-900/95 dark:to-blue-900/90 z-10" />

        {/* Three.js canvas with mobile optimization */}
        {webGLAvailable && (
          <div className="absolute inset-0 hidden md:block">
            <ThreeJSContent />
          </div>
        )}

        {/* Main content overlay */}
        <div className="relative z-20 flex items-center justify-center min-h-[50vh] md:h-[85vh] px-4 py-6 md:py-0">
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 text-gray-800 dark:text-white leading-tight"
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
              className="min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center mb-2 md:mb-3"
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                {headlines[currentHeadline]}
              </p>
            </motion.div>

            {/* Professional biography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-5 max-w-xl mx-auto leading-relaxed px-4"
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
              className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center items-center px-4 py-2"
            >
              <a
                href="https://drive.google.com/file/d/1EjIs-sIQrmHf0vRoQ9pTiDM_4M5x_P2p/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target btn-primary px-3 py-1.5 text-xs md:text-sm w-full sm:w-auto text-center"
              >
                Download Resume
              </a>
              <a
                href="#projects"
                className="touch-target btn-primary px-3 py-1.5 text-xs md:text-sm w-full sm:w-auto text-center"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="touch-target btn-secondary px-3 py-1.5 text-xs md:text-sm w-full sm:w-auto text-center"
              >
                Let's Connect
              </a>
            </motion.div>

            {/* Social media links for credibility and connection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex justify-center items-center space-x-3 mt-4"
            >
              <motion.a
                href="https://github.com/ayushrai-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={18} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/ayushrai02"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={18} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
              </motion.a>
              <motion.a
                href="mailto:ayushrai0211@gmail.com"
                className="p-1.5 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={18} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThreeJSHero;
