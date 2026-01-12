/**
 * Research.tsx — Academic research projects and achievements showcase component.
 *
 * This component displays Ayush Rai's research contributions spanning AI/ML, IoT, and
 * educational technology domains. Features academic project details, research impact metrics,
 * and achievement acknowledgments with interactive exploration. Includes both completed
 * research initiatives and academic recognitions with comprehensive project documentation.
 *
 * The component includes:
 * - Research project showcase with detailed descriptions
 * - Technology stack and implementation details for each project
 * - Impact assessment and measurable outcomes
 * - Academic awards and competition recognition
 * - Institutional affiliations and funding sources
 * - Technology domains: AI/ML, IoT, Agricultural Tech, Smart Campus
 *
 * Research Domains Covered:
 * - Agricultural AI applications and Computer Vision
 * - NLP and legal document analysis
 * - Smart Campus energy optimization and IoT
 * - Academic collaborations and impact assessment
 *
 * @component
 * @example
 * ```tsx
 * import Research from './components/Research';
 *
 * function App() {
 *   return <Research />;
 * }
 * ```
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Microscope, Award } from "lucide-react";

/**
 * Research — Academic research showcase component.
 *
 * Displays comprehensive research portfolio including AI/ML projects,
 * IoT implementations, and academic achievements. Features detailed
 * project documentation with impact assessment and technology stacks.
 *
 * @component
 * @returns {JSX.Element} The rendered Research section
 *
 * @example
 * ```tsx
 * <Research />
 * ```
 *
 * @see {@link src/components/Education.tsx} for academic background
 * @see {@link src/components/Projects.tsx} for web development work
 */
const Research: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const researchProjects = [
    {
      title: "AI-Powered Agricultural Advisory System",
      duration: "Jan 2024 - Present",
      funding: "IIT Madras BS Program",
      description:
        "Developing an AI system to provide real-time farming recommendations based on satellite imagery, soil sensors, and weather data.",
      technologies: [
        "Python",
        "TensorFlow",
        "Satellite API",
        "Computer Vision",
      ],
      outcomes:
        "Prototype deployed for 20+ farmers, 85% prediction accuracy achieved",
    },
    {
      title: "NLP for Legal Document Analysis",
      duration: "Aug 2023 - Dec 2023",
      funding: "LNCT Internal Research Grant",
      description:
        "Building NLP pipelines for automated analysis of legal contracts and regulatory documents.",
      technologies: ["Python", "Transformers", "Legal NLP", "BERT"],
      outcomes:
        "Reduced document processing time by 60%, analyzed 10,000+ legal documents",
    },
    {
      title: "Smart Campus Energy Management",
      duration: "Mar 2023 - Aug 2023",
      funding: "BHOPAL SMART CITY INITIATIVE",
      description:
        "IoT-based energy monitoring and optimization system for university campus buildings.",
      technologies: [
        "IoT",
        "Machine Learning",
        "Sensor Networks",
        "Web Dashboard",
      ],
      outcomes:
        "15% energy savings achieved, real-time monitoring dashboard developed",
    },
  ];

  const achievements = [
    {
      title: "Top 5 Finalist - Smart India Hackathon 2024",
      organization: "Ministry of Education, Government of India",
      year: "2024",
      description:
        "Led a team of 4 developers to build an innovative blockchain-based voting system for secure elections.",
    },
    {
      title: "Best Research Paper Award",
      organization: "National Conference on Emerging Technologies",
      year: "2023",
      description:
        "Honored for paper on Federated Learning applications in healthcare.",
    },
    {
      title: "ACM Student Research Competition Finalist",
      organization: "CCSE 2023 Conference",
      year: "2023",
      description:
        "Selected as one of 20 finalists from 120+ submissions for research presentation.",
    },
  ];

  return (
    <section id="research" className="py-8 md:py-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        {/* Research Projects */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
            Research <span className="text-blue-600">Projects</span>
          </h2>
          <div className="w-20 h-0.5 bg-blue-600 mx-auto rounded-full mb-4"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-3">
                  <Microscope className="text-secondary dark:text-secondary mr-2" size={18} />
                  <span className="px-2 py-0.5 bg-secondary/20 dark:bg-secondary/20 text-secondary dark:text-secondary rounded text-xs font-semibold">
                    {project.funding}
                  </span>
                </div>

                <h4 className="text-base font-bold mb-1.5 text-gray-800 dark:text-white">
                  {project.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{project.duration}</p>

                <p className="text-xs text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-3">
                  <h5 className="text-xs font-semibold text-secondary dark:text-accent mb-1.5">
                    Technologies:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-1.5 py-0.5 bg-gray-100 dark:bg-primary-dark rounded-md text-xs text-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <p className="text-xs text-blue-600 dark:text-blue-400 italic leading-tight">
                    "{project.outcomes}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements & Awards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
            Awards & <span className="text-blue-600">Achievements</span>
          </h2>
          <div className="w-20 h-0.5 bg-blue-600 mx-auto rounded-full mb-4"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-2">
                  <Award className="text-secondary dark:text-accent mr-2" size={16} />
                  <span className="text-secondary dark:text-accent font-bold text-sm">
                    {achievement.year}
                  </span>
                </div>

                <h4 className="text-base font-bold mb-1.5 text-gray-800 dark:text-white">
                  {achievement.title}
                </h4>
                <p className="text-xs text-secondary dark:text-secondary mb-2">
                  {achievement.organization}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Research;
