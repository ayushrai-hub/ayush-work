import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
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
          >
            {item.icon}
          </Link>

          {/* Expanded label on hover */}
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
    </motion.div>
  );
};

export default FloatingNav;
