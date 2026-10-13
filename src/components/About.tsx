/**
 * Legacy "My Story" section: a short biography plus four core-value cards.
 *
 * Legacy: not imported by the current site (src/App.tsx routes use src/pages).
 * Kept for reference; excluded from tsconfig.app.json. Covered only by
 * src/__tests__/legacy/About.test.tsx, which Vitest excludes.
 *
 * The biography and values are hard-coded in this file rather than read from
 * src/content/. Sections fade in once via react-intersection-observer and
 * framer-motion.
 *
 * Connects to:
 * - No importers in src/ (sibling legacy section: src/components/AboutMe.tsx)
 * - framer-motion, react-intersection-observer, lucide-react
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Code, Users, Lightbulb } from "lucide-react";

/**
 * Renders `<section id="about">` with the biography column and a grid of the
 * hard-coded `values` cards. Animations start once the heading enters the viewport.
 * The `card` class is no longer defined in src/index.css or the Tailwind config.
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
    <section id="about" className="py-8 md:py-10 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            My <span className="text-secondary dark:text-secondary-400">Story</span>
          </h2>
          <div className="w-20 h-0.5 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The Polymath's Journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-secondary dark:text-secondary-400">My Story</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
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
              <blockquote className="mt-3 text-gray-600 dark:text-gray-300 italic text-sm md:text-base leading-relaxed border-l-2 border-secondary dark:border-secondary-400 pl-3">
                "Technology should amplify human potential, not replace it. As a
                polymath, I bridge the gap between different domains to create
                holistic solutions that address real-world challenges."
              </blockquote>
              <cite className="block mt-2 text-secondary-500 dark:text-secondary-400 font-semibold text-xs md:text-sm">
                - Ayush Rai
              </cite>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-secondary dark:text-secondary-400">
              Core Values & Approach
            </h3>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="card border border-secondary/20 dark:border-accent/20"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full mb-3">
                    <value.icon size={18} className="text-white" />
                  </div>
                  <h4 className="text-base font-bold mb-2 text-gray-800 dark:text-white">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{value.description}</p>
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
