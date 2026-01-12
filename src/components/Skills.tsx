/**
 * Skills.tsx — Technical skills visualization component with categorized display.
 *
 * This component presents Ayush Rai's technical expertise across multiple domains
 * through an interactive grid layout showcasing distinct skill categories with icons
 * and animated skill tags. Features responsive design with smooth hover interactions
 * and scroll-based animations using Framer Motion.
 *
 * The component includes:
 * - Six core skill categories (AI & ML, Web Dev, Data Science, etc.)
 * - Visual skill tag cloud for each category
 * - Responsive grid layout adapting to screen sizes
 * - Smooth animations and hover effects
 * - Icon-based category representation
 *
 * @component
 * @example
 * ```tsx
 * import Skills from './components/Skills';
 *
 * function App() {
 *   return <Skills />;
 * }
 * ```
 *
 * @see {@link src/components/Experience.tsx} for specific technology usage in work
 * @see {@link src/components/Projects.tsx} for practical skill applications
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code, Brain, Database, Cloud, Users, Lightbulb } from "lucide-react";

/**
 * Skills — Technical skills visualization component.
 *
 * Renders an interactive skills showcase with categorized expertise areas,
 * featuring animated skill tags, responsive grid layout, and smooth hover effects.
 * Provides clear overview of technical capabilities across multiple domains.
 *
 * @component
 * @returns {JSX.Element} The rendered Skills section
 *
 * @example
 * ```tsx
 * <Skills />
 * ```
 */
const Skills: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const skillCategories = [
    {
      icon: Brain,
      title: "AI & ML",
      skills: [
        "Python", "LLMs", "PyTorch", "Prompt Engineering"
      ],
      color: "from-accent to-secondary",
    },
    {
      icon: Code,
      title: "Web Dev",
      skills: [
        "React", "TypeScript", "Node.js", "JavaScript"
      ],
      color: "from-secondary to-tertiary",
    },
    {
      icon: Database,
      title: "Data Science",
      skills: [
        "SQL", "Pandas", "NumPy", "Tableau"
      ],
      color: "from-tertiary to-accent",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: [
        "AWS", "Docker", "Git", "CI/CD"
      ],
      color: "from-accent to-secondary",
    },
    {
      icon: Users,
      title: "Leadership",
      skills: [
        "Team Mgmt", "Project Mgmt", "Mentoring", "Strategy"
      ],
      color: "from-secondary to-tertiary",
    },
    {
      icon: Lightbulb,
      title: "Creative",
      skills: [
        "Problem Solving", "Innovation", "Design Thinking", "Communication"
      ],
      color: "from-tertiary to-accent",
    },
  ];

  return (
    <section id="skills" className="py-8 md:py-10 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Multi-Disciplinary <span className="text-secondary dark:text-secondary-400">Skills</span>
          </h2>
          <div className="w-20 h-0.5 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Technical Expertise Across Multiple Domains
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
              className="group card"
            >
              <motion.div 
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 bg-gradient-to-r ${category.color}`}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <category.icon size={18} className="text-white" />
              </motion.div>
              <h3 className="text-base font-bold mb-2 text-gray-800 dark:text-white group-hover:text-secondary dark:group-hover:text-accent transition-colors duration-300">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 * categoryIndex + 0.03 * skillIndex,
                    }}
                    className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-secondary/10 dark:hover:bg-gray-600 hover:text-secondary dark:hover:text-secondary transition-all duration-300 cursor-default"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
