/**
 * About.tsx — Personal story and core values presentation component.
 *
 * This component displays Ayush Rai's personal journey, core values, and professional approach
 * as a polymath in AI engineering and full-stack development. It features animated sections
 * showcasing strategic thinking, technical innovation, community leadership, and continuous learning.
 *
 * @component
 * @example
 * ```tsx
 * import About from './components/About';
 *
 * function App() {
 *   return <About />;
 * }
 * ```
 *
 * @see {@link src/components/AboutMe.tsx} for detailed personal profile
 * @see {@link src/components/Hero.tsx} for landing section
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Code, Users, Lightbulb } from "lucide-react";

/**
 * About — Main About section component displaying personal story and values.
 *
 * Renders an animated section that introduces the user with their professional journey,
 * core principles, and value proposition. Uses Framer Motion for smooth animations and
 * React Intersection Observer for performance-optimized animations.
 *
 * The component displays:
 * - Personal story with background and current pursuits
 * - Core values with icons and descriptions
 * - Animated entrance effects on scroll
 *
 * @component
 * @returns {JSX.Element} The rendered About section
 *
 * @example
 * ```tsx
 * <About />
 * ```
 *
 * @see {@link src/lib/types} for shared type definitions
 * @see {@link src/styles/globals.css} for animation classes
 */
const About: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const values = [
    {
      icon: Brain,
      title: "Strategic Thinking",
      description:
        "Approaching complex problems with analytical depth and strategic foresight across multiple disciplines.",
    },
    {
      icon: Code,
      title: "Technical Innovation",
      description:
        "Leveraging cutting-edge technologies to create scalable solutions that drive meaningful impact.",
    },
    {
      icon: Users,
      title: "Community Leadership",
      description:
        "Building and nurturing communities while mentoring others in their technical and professional growth.",
    },
    {
      icon: Lightbulb,
      title: "Continuous Learning",
      description:
        "Embracing the polymath mindset with insatiable curiosity and commitment to lifelong learning.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            My <span className="text-secondary dark:text-secondary-400">Story</span>
          </h2>
          <div className="w-24 h-1 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The Polymath's Journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-secondary dark:text-secondary-400">My Story</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              <p>
                I'm a technology enthusiast with a unique blend of technical
                expertise and strategic thinking. I graduated in 2024 from LNCT
                Group of Colleges, Bhopal, and I am currently pursuing a degree
                in Data Science at IIT Madras.
              </p>
              <p>
                In today's interconnected world and the ongoing AI revolution, I
                believe that interdisciplinary skills and knowledge provide the
                most important perspective for solving complex challenges. My
                journey spans across AI/ML development, full-stack web
                development, data science, and community leadership.
              </p>
              <blockquote className="mt-4 text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed">
                "Technology should amplify human potential, not replace it. As a
                polymath, I bridge the gap between different domains to create
                holistic solutions that address real-world challenges."
              </blockquote>
              <cite className="block mt-2 text-secondary-500 dark:text-secondary-400 font-semibold">
                - Ayush Rai
              </cite>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-secondary dark:text-secondary-400">
              Core Values & Approach
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-glass rounded-2xl p-6 border border-accent/20"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full mb-4">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
