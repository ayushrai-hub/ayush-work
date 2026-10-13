/**
 * Legacy floating vertical nav of emoji links to secondary pages, shown after scrolling.
 *
 * Legacy: not imported anywhere in src/. Kept for reference; excluded from
 * tsconfig.app.json. No test covers it.
 *
 * A scroll listener (not throttled) shows the nav once `window.scrollY` passes
 * 200px; otherwise it renders null. Each item is a react-router `Link` with an
 * aria-label, and hovering shows a label tooltip. The targets resolve in
 * src/App.tsx, though /certifications, /services, and /extracurriculars are now
 * redirects. There is no scroll-to-top or smooth scrolling.
 *
 * Connects to:
 * - No importers in src/ (the legacy header is src/components/layout/Header.tsx)
 * - react-router-dom `Link` (requires a router ancestor), framer-motion
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Returns null until the page is scrolled past 200px, then a fixed `<nav>` on the
 * right edge. The tooltip's `exit` animation never runs because it is not inside AnimatePresence.
 */
const FloatingNav: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Research', href: '/research', icon: '🔬' },
    { label: 'Leadership', href: '/leadership', icon: '👥' },
    { label: 'Certifications', href: '/certifications', icon: '🏆' },
    { label: 'Services', href: '/services', icon: '💼' },
    { label: 'Extra-curriculars', href: '/extracurriculars', icon: '🎯' },
  ];

  if (!isVisible) return null;

  return (
    <motion.nav
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      role="navigation"
      aria-label="Page sections navigation"
    >
      {navItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="relative"
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <Link
            to={item.href}
            className="block w-12 h-12 bg-primary-dark/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-accent transition-colors duration-300"
            title={item.label}
            aria-label={`Navigate to ${item.label} section`}
          >
            {item.icon}
          </Link>

          {/* Expanded tooltip on hover */}
          {hoveredIndex === index && (
            <motion.div
              className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-primary-dark/95 backdrop-blur-md text-white px-3 py-1 rounded-lg shadow-lg whitespace-nowrap"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-primary-dark/95 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
};

export default FloatingNav;
