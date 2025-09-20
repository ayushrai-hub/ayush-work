import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useGTM } from '../hooks/useGTM';
// import profileImage from '../assets/E232F4CF-1BC6-4BB4-A659-75BD42299F6E_1_105_c.jpeg';

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
    <section id="aboutme" className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              About <span className="text-blue-600">Me</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Profile Image Section */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative group">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                
                {/* Main image container */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src="/profile-image.jpeg"
                      alt="Ayush Rai - AI Engineer & Full-Stack Developer"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      loading="eager"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        // Fallback to a placeholder
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
                      }}
                      onLoad={() => console.log('Profile image loaded successfully')}
                    />
                  </div>
                  
                  {/* Name badge */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border-2 border-blue-500">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Ayush Rai
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  AI Engineer, Developer & Polymath
                </h3>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  I'm a passionate <strong>AI Engineer</strong> and <strong>Full-Stack Developer </strong> 
                  specializing in <strong>RLHF (Reinforcement Learning from Human Feedback)</strong>, 
                  <strong>Generative AI</strong>, and cutting-edge web technologies.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Currently pursuing dual degrees from <strong>LNCTS Bhopal</strong> and 
                  <strong>IIT Madras</strong>, I combine academic excellence with practical 
                  industry experience to create innovative solutions.
                </p>
              </div>

              {/* Key highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-blue-600 mb-1">2+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-green-600 mb-1">20+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-purple-600 mb-1">AI/ML</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Specialization</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-orange-600 mb-1">Full-Stack</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Development</div>
                </div>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['Python', 'React', 'TypeScript', 'AI/ML', 'LLMs', 'RLHF', 'Data Science', 'Cloud'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleConnectClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  Let's Connect
                </button>
                <a
                  href="https://calendly.com/ayushrai0211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 text-center"
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
