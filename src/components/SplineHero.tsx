import React from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Github, Linkedin, Mail } from 'lucide-react';

const headlines = [
  'SDE - AI Engineer | Generative AI Specialist',
  'Full-Stack Developer | Data Science Enthusiast',
  'Product Builder | Lifelong learner',
];

const SplineHero: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home">
      <div className="relative w-full min-h-screen overflow-hidden" style={{ background: 'linear-gradient(to br, #1a237e 0%, #000051 100%)' }}>
        {/* Spline Animation - Left Position */}
        <div className="absolute left-0 top-0 w-3/5 h-full z-0 flex items-center justify-center">
          <div className="w-full h-full">
            <Spline scene="https://prod.spline.design/f10YGDNKvKk5vJA9/scene.splinecode" />
          </div>
        </div>

        {/* Gradient Overlay for Blending */}
        <div className="absolute left-3/5 top-0 w-2/5 h-full z-10 bg-gradient-to-l from-transparent via-blue-900/20 to-transparent"></div>

        {/* Content Container - Right Side */}
        <div className="relative z-20 w-full h-screen flex">
          {/* Left Space for Animation */}
          <div className="w-2/3 flex items-center justify-start p-16">
            {/* Adjusted for balance */}
          </div>

          {/* Right Content Area */}
          <div className="w-1/3 flex items-start justify-center p-8 md:p-16" style={{ marginLeft: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="flex flex-col items-start justify-start text-left space-y-8 max-w-md"
            >
              {/* Name - Prominent Upper-Right */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-3xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-normal"
                style={{
                  textShadow: '0 0 30px rgba(0, 188, 212, 0.8), 0 0 60px rgba(0, 188, 212, 0.4)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Ayush Rai
              </motion.h1>

              {/* Tagline/Role - Below Name */}
              <motion.div
                key={currentHeadline}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="min-h-[3rem] md:min-h-[4rem] flex items-center"
              >
                <p className="text-lg md:text-xl lg:text-2xl text-cyan-300 font-medium leading-relaxed"
                   style={{ textShadow: '0 0 15px rgba(0, 188, 212, 0.6)' }}>
                  {headlines[currentHeadline]}
                </p>
              </motion.div>

              {/* Description Text - Reorganized */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="text-base md:text-lg lg:text-xl text-blue-100 leading-relaxed font-light tracking-wide"
                style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.15)' }}
              >
                Exploring the intersection of AI, web technologies, and problem-solving for transformative solutions.
              </motion.p>

              {/* Reorganized CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.0 }}
                className="flex flex-col gap-4 w-full mt-8"
              >
                <motion.a
                  href="https://drive.google.com/file/d/1EjIs-sIQrmHf0vRoQ9pTiDM_4M5x_P2p/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-cyan-500/40 text-center"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0, 188, 212, 0.7)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Download Resume
                </motion.a>

                <motion.a
                  href="#projects"
                  className="w-full px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-lg text-center"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore My Work
                </motion.a>

                <motion.a
                  href="#contact"
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-purple-500/40 text-center"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Let's Connect
                </motion.a>
              </motion.div>

              {/* Repositioned Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.4 }}
                className="flex justify-start items-center space-x-6 pt-8"
              >
                <motion.a
                  href="https://github.com/ayushrai-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/25 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-md shadow-lg"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={24} className="text-white" />
                </motion.a>

                <motion.a
                  href="https://linkedin.com/in/ayushrai02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/25 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-md shadow-lg"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={24} className="text-white" />
                </motion.a>

                <motion.a
                  href="mailto:ayushrai0211@gmail.com"
                  className="p-3 bg-white/10 hover:bg-white/25 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-md shadow-lg"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={24} className="text-white" />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Subtle Cosmic Particles for Theme Integration */}
        <div className="absolute inset-0 z-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-cyan-400 rounded-full opacity-10"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -5, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SplineHero;
