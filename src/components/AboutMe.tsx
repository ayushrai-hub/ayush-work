/**
 * AboutMe.tsx — Detailed personal profile component with analytics integration.
 *
 * This component provides an in-depth personal profile section featuring professional background,
 * skills showcase, key achievements, and interactive call-to-action buttons. It integrates
 * Google Tag Manager (GTM) analytics tracking for user engagement measurement.
 *
 * The component includes:
 * - Professional background and current education
 * - Skills tag cloud with key technologies
 * - Achievement metrics and statistics
 * - Interactive buttons with analytics tracking
 * - Responsive design with animations
 *
 * @component
 * @example
 * ```tsx
 * import { AboutMe } from './components/AboutMe';
 *
 * function App() {
 *   return <AboutMe />;
 * }
 * ```
 *
 * @see {@link src/hooks/useGTM.ts} for analytics integration
 * @see {@link src/components/Contact.tsx} for contact form
 * @see {@link src/lib/profilesData.ts} for profiles configuration
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useGTM } from '../hooks/useGTM';

/**
 * AboutMe — Comprehensive personal profile component.
 *
 * Renders a detailed personal profile section with professional background,
 * skills showcase, achievements, and interactive CTAs. Features smooth animations,
 * responsive design, and integrates with Google Tag Manager for analytics tracking.
 *
 * @component
 * @returns {JSX.Element} The rendered AboutMe section
 *
 * @example
 * ```tsx
 * <AboutMe />
 * ```
 */
export const AboutMe: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { trackButton } = useGTM();

  const handleConnectClick = () => {
    // Track the button click for analytics
    trackButton('lets_connect_cta', 'about_me_section');
    
    // Smooth scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="aboutme" className="py-6 md:py-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-1.5">
              About <span className="text-blue-600">Me</span>
            </h2>
            <div className="w-16 h-0.5 bg-blue-600 mx-auto rounded-full mb-3"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-6 items-center">
            {/* Profile Image Section */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative group">
                {/* Background decoration */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                
                {/* Main image container */}
                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl">
                  <div className="aspect-[3/4] max-w-[200px] mx-auto rounded-lg overflow-hidden">
                    <img
                      src={`/IMG_0029.jpeg?v=${Date.now()}`}
                      alt="Ayush Rai - AI Engineer & Full-Stack Developer"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-500"
                      loading="eager"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        // Fallback to a placeholder
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=75';
                      }}
                      onLoad={() => console.log('Profile image loaded successfully')}
                    />
                  </div>
                  
                  {/* Name badge */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-lg border-2 border-blue-500">
                      <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                        Ayush Rai
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-2 -right-2 w-12 h-12 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2.5">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                  AI Engineer, Developer & Polymath
                </h3>
                
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  I'm a passionate <strong>AI Engineer</strong> and <strong>Full-Stack Developer </strong> 
                  specializing in <strong>RLHF (Reinforcement Learning from Human Feedback)</strong>, 
                  <strong>Generative AI</strong>, and cutting-edge web technologies.
                </p>

                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Currently pursuing dual degrees from <strong>LNCTS Bhopal</strong> and 
                  <strong>IIT Madras</strong>, I combine academic excellence with practical 
                  industry experience to create innovative solutions.
                </p>
              </div>

              {/* Key highlights */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mt-4">
                <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-0.5">2+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-0.5">20+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Projects Completed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400 mb-0.5">AI/ML</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Specialization</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400 mb-0.5">Full-Stack</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Development</div>
                </div>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {['Python', 'React', 'TypeScript', 'AI/ML', 'LLMs', 'RLHF', 'Data Science', 'Cloud'].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleConnectClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-600 dark:to-purple-600 text-white px-4 py-1.5 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-700 transform hover:scale-105 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 text-xs"
                >
                  Let's Connect
                </button>
                <a
                  href="https://calendly.com/ayushrai0211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-1.5 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-800 transform hover:scale-105 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 text-center text-xs"
                >
                  Schedule Call
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
