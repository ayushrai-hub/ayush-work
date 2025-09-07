import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail, Phone } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

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
  }, []);

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
      className="min-h-screen flex flex-col justify-center relative pt-20"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm <span className="gradient-text">Ayush Rai</span>
          </h1>

          <motion.div
            key={currentHeadline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="h-16 flex items-center justify-center"
          >
            <p className="text-xl md:text-2xl text-gray-300">
              {headlines[currentHeadline]}
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
        >
          Polymath with strategic approach across AI, web development, data
          science, and community leadership. Currently specializing in RLHF and
          Generative AI while pursuing dual degrees in Computer Science and Data
          Science.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <a href="#contact" className="btn-primary">
            Let's Work Together
          </a>
          <a href="#projects" className="btn-secondary">
            View My Work
          </a>
          <a
            href="https://drive.google.com/file/d/1EjIs-sIQrmHf0vRoQ9pTiDM_4M5x_P2p/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Download Resume
          </a>
        </motion.div>

        {/* Contact Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex justify-center space-x-6 mb-16"
        >
          <a
            href="mailto:ayushrai0211@gmail.com"
            className="text-gray-400 hover:text-accent transition-colors p-2"
          >
            <Mail size={24} />
          </a>
          <a
            href="tel:+917440567944"
            className="text-gray-400 hover:text-accent transition-colors p-2"
          >
            <Phone size={24} />
          </a>
          <a
            href="https://github.com/ayushrai-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent transition-colors p-2"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/ayushrai02"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent transition-colors p-2"
          >
            <Linkedin size={24} />
          </a>
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {inView && (
                  <CountUp end={stat.value} duration={2} delay={index * 0.2} />
                )}
                {stat.suffix}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <span className="flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
            🟢 Available for Freelance Projects
          </span>
          <span className="flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
            🔵 Open to Full-time Opportunities
          </span>
          <span className="flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
            🟡 Actively Learning: Advanced AI/ML
          </span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-accent"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
