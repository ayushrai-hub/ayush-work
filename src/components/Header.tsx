import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();

  const menuItems = [
    { label: "Home", href: "/", isRoute: true },
    { label: "About Me", href: "#aboutme", isRoute: false },
    { label: "Experience", href: "#experience", isRoute: false },
    { label: "Projects", href: "#projects", isRoute: false },
    { label: "Education", href: "#education", isRoute: false },
    { label: "Skills", href: "#skills", isRoute: false },
    { label: "Other", href: "#other", isRoute: false },
    { label: "Contact", href: "#contact", isRoute: false },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary-dark/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/profile-image.jpeg" 
              alt="Ayush Rai" 
              className="w-10 h-10 rounded-full object-cover border-2 border-accent"
            />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`text-gray-300 hover:text-accent transition-colors duration-300 ${
                      location.pathname === item.href ? 'text-accent' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-accent transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 bg-primary-dark rounded-lg p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`block py-2 text-gray-300 hover:text-accent transition-colors ${
                      location.pathname === item.href ? 'text-accent' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="block py-2 text-gray-300 hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
