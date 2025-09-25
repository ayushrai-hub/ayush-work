import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle navigation to sections
  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on main page, navigate to main page first
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on main page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const workItems = [
    { label: "Research", href: "/research", description: "Research projects and academic achievements", icon: "🔬" },
    { label: "Leadership", href: "/leadership", description: "Community leadership and mentorship activities", icon: "👥" },
    { label: "Certifications", href: "/certifications", description: "Professional certifications and credentials", icon: "🏆" },
    { label: "Services", href: "/services", description: "Professional services and consulting offerings", icon: "💼" },
    { label: "Extra-curriculars", href: "/extracurriculars", description: "Personal interests, hobbies, and community involvement", icon: "🎯" },
  ];

  const menuItems = [
    { label: "Home", href: "/", isRoute: true },
    { label: "About Me", href: "#aboutme", isRoute: false },
    { label: "Experience", href: "#experience", isRoute: false },
    { label: "Projects", href: "#projects", isRoute: false },
    { label: "Education", href: "#education", isRoute: false },
    { label: "Skills", href: "#skills", isRoute: false },
    { label: "Work", href: "#work", isRoute: false, isDropdown: true },
    { label: "Contact", href: "#contact", isRoute: false },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary-dark/95 dark:bg-primary-dark/95 bg-white/95 backdrop-blur-md shadow-lg"
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
            className="flex-shrink-0 mr-4"
          >
            <Link to="/">
              <img
                src="/profile-image.jpeg"
                alt="Ayush Rai"
                className="w-10 h-10 rounded-full object-cover border-2 border-accent cursor-pointer hover:border-accent/80 transition-colors"
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {item.isDropdown ? (
                  <button
                    onClick={() => setWorkDropdownOpen(!workDropdownOpen)}
                    className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors duration-300 flex items-center"
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 transform transition-transform ${workDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                  </button>
                ) : item.isRoute ? (
                  <button
                    onClick={() => {
                      if (item.href === '/' && location.pathname !== '/') {
                        navigate('/');
                      } else if (item.href !== '/') {
                        navigate(item.href);
                      }
                    }}
                    className={`text-gray-700 dark:text-gray-300 hover:text-accent transition-colors duration-300 ${
                      location.pathname === item.href ? 'text-accent' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSectionNavigation(item.href.substring(1))}
                    className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                )}
              </motion.div>
            ))}

            {/* Theme Toggle for Desktop */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: menuItems.length * 0.1 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="touch-target text-gray-700 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 bg-white dark:bg-primary-dark rounded-lg p-4 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.isRoute ? (
                  <button
                    onClick={() => {
                      if (item.href === '/' && location.pathname !== '/') {
                        navigate('/');
                      } else if (item.href !== '/') {
                        navigate(item.href);
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors text-left w-full ${
                      location.pathname === item.href ? 'text-accent' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ) : item.isDropdown ? (
                  <div>
                    <button
                      onClick={() => setWorkDropdownOpen(!workDropdownOpen)}
                      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors flex items-center w-full"
                    >
                      {item.label}
                      <ChevronDown className={`ml-1 transform transition-transform ${workDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                    </button>
                    {workDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-1">
                        {workItems.map((workItem) => (
                          <Link
                            key={workItem.label}
                            to={workItem.href}
                            className="block py-1 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors text-sm"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setWorkDropdownOpen(false);
                            }}
                          >
                            {workItem.icon} {workItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleSectionNavigation(item.href.substring(1));
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors text-left w-full"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Work Dropdown for Desktop */}
        {workDropdownOpen && (
          <motion.div
            className="hidden md:block absolute top-full right-0 mt-2 bg-white dark:bg-primary-dark/95 backdrop-blur-md rounded-lg shadow-lg p-4 min-w-[280px] border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-2">
              {workItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  onClick={() => setWorkDropdownOpen(false)}
                >
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-accent">{item.label}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
