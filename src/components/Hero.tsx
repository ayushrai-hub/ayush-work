/**
 * Legacy landing hero: photo, rotating headline, intro paragraph, link buttons, count-up stats, and availability badges.
 *
 * Legacy: not imported by the current site (src/App.tsx renders src/pages/HomePage.tsx
 * at "/"). Kept for reference; excluded from tsconfig.app.json. Covered only by
 * src/__tests__/legacy/Hero.test.tsx, which Vitest excludes.
 *
 * A 3-second interval cycles through `headlines`. The stats are hard-coded and
 * unverified, and the section links a phone number, which AGENTS.md keeps off
 * the current site. In-page links target `#contact` and `#projects`, which only
 * exist when the legacy Contact and Projects sections are on the same page.
 *
 * Connects to:
 * - No importers in src/
 * - framer-motion, react-countup, react-intersection-observer, lucide-react
 * - /IMG_0029.jpeg from public/
 */
import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Globe, Linkedin, Mail, Phone } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

/**
 * Renders `<section id="home">`. The entrance animations play on mount; only the
 * CountUp counters wait for the stats grid to enter the viewport. The headline
 * `exit` animation never runs because the element is not inside AnimatePresence.
 */
const Hero: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  const headlines = [
    "SDE - AI Engineer | Generative AI Specialist",
    "Full-Stack Developer | Data Science Enthusiast",
    "Community Leader | Technical Innovator",
    "Polymath with Strategic Approach",
    "RLHF Specialist | LLM Optimizer",
  ];

  const [currentHeadline, setCurrentHeadline] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const stats = [
    { value: 2, label: "Years Experience", suffix: "+" },
    { value: 2, label: "Companies Worked", suffix: "" },
    { value: 15, label: "Projects Completed", suffix: "+" },
    { value: 8, label: "Certifications", suffix: "+" },
    { value: 5, label: "Leadership Roles", suffix: "+" },
    { value: 10, label: "Technologies", suffix: "+" },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center relative pt-20 pb-20"
    >
      <div className="container mx-auto px-4 text-center">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-accent shadow-xl">
            <img
              src="/IMG_0029.jpeg"
              alt="Ayush Rai"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Hi, I'm <span className="gradient-text">Ayush Rai</span>
          </h1>

          <motion.div
            key={currentHeadline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="h-10 flex items-center justify-center"
          >
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              {headlines[currentHeadline]}
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-4xl mx-auto leading-relaxed"
        >
          Polymath with strategic approach across AI, web development, data
          science, and community leadership. Currently specializing in RLHF and
          Generative AI while pursuing dual degrees in Computer Science and Data
          Science. Passionate about creating innovative solutions that bridge
          technology and human experience.
        </motion.p>

        {/* Social Media Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          <a
            href="https://linkedin.com/in/ayushrai02"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
          <a
            href="https://github.com/ayushrai-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <Github size={14} />
            GitHub
          </a>
          <a
            href="https://thelifeofayush.vercel.app/sites/www/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            <Globe size={14} />
            MyLifeOS
          </a>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          <a href="#contact" className="btn-primary text-xs px-3 py-1.5">
            Let's Work Together
          </a>
          <a href="#projects" className="btn-secondary text-xs px-3 py-1.5">
            View My Work
          </a>
          <a
            href="https://drive.google.com/file/d/1EjIs-sIQrmHf0vRoQ9pTiDM_4M5x_P2p/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs px-3 py-1.5"
          >
            Download Resume
          </a>
        </motion.div>

        {/* Contact Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex justify-center space-x-4 mb-4"
        >
          <a
            href="mailto:ayushrai0211@gmail.com"
            className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"
            title="Email"
          >
            <Mail size={18} />
          </a>
          <a
            href="tel:+917440567944"
            className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"
            title="Phone"
          >
            <Phone size={18} />
          </a>
          <a
            href="https://github.com/ayushrai-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/ayushrai02"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && (
                  <CountUp end={stat.value} duration={2} delay={index * 0.2} />
                )}
                {stat.suffix}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          <span className="flex items-center bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs border border-blue-200 dark:border-blue-500/20">
            🔵 Available for Freelance Projects
          </span>
          <span className="flex items-center bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs border border-blue-200 dark:border-blue-500/20">
            🔵 Open to Full-time Opportunities
          </span>
          <span className="flex items-center bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2.5 py-0.5 rounded-full text-xs border border-yellow-200 dark:border-yellow-500/20">
            🟡 Actively Learning: Advanced AI/ML
          </span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-secondary dark:text-accent"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
