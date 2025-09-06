import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Services from './components/Services';
import Contact from './components/Contact';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-primary text-white relative overflow-x-hidden">
      <ParticleBackground />
      
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Services />
        <Contact />
      </motion.main>

      <footer className="bg-primary-dark border-t border-accent/20 py-8 text-center relative z-10">
        <div className="container mx-auto px-4">
          <p className="text-gray-300">
            © 2025 Ayush Rai. All rights reserved. Built with React & TypeScript.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="mailto:ayushrai0211@gmail.com" className="text-accent hover:text-secondary transition-colors">
              Email
            </a>
            <a href="https://github.com/ayushrai-hub" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-secondary transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/ayushrai02" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-secondary transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;