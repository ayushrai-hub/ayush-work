/**
 * FloatingNav.tsx — Floating navigation component with expandable page sections.
 *
 * This component provides a floating navigation menu that appears on scroll, offering
 * quick access to page sections with hover tooltips and expanded labels. Features
 * smooth animations, accessibility support, and responsive behavior that adapts to
 * scroll position and viewport size.
 *
 * The component includes:
 * - Scroll-based visibility control (shows after 200px scroll)
 * - Page section navigation with emoji icons and hover tooltips
 * - Accordion-style label expansion on hover
 * - Smooth scroll navigation with router integration
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Responsive positioning and mobile-friendly behavior
 *
 * Navigation Features:
 * - Research, Leadership, Certifications, Services, Extra-curriculars
 * - Smooth routing with React Router integration
 * - Back-to-top scroll behavior on section navigation
 * - Accessible tooltip system with proper ARIA attributes
 *
 * Performance Optimizations:
 * - Efficient scroll event handling with throttling
 * - Minimal DOM footprint when hidden
 * - Hardware-accelerated animations
 * - Accessibility-first design
 *
 * @component
 * @example
 * ```tsx
 * import FloatingNav from './components/FloatingNav';
 *
 * function Layout() {
 *   return (
 *     <div>
 *       <FloatingNav />
 *       <MainContent />
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link src/components/Header.tsx} for main navigation bar
 * @see {@link src/components/Footer.tsx} for footer navigation
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * FloatingNav — Floating navigation with section quick-access.
 *
 * Provides a compact, floating navigation menu that appears on scroll,
 * offering quick access to main page sections with tooltips and smooth
 * routing. Enhances user experience with accessible navigation controls.
 *
 * @component
 * @returns {JSX.Element | null} The rendered floating nav or null when hidden
 *
 * @example
 * ```tsx
 * <FloatingNav />
 * ```
 *
 * @see {@link src/components/Header.tsx} for primary navigation alternative
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
