/**
 * Experience.tsx — Professional experience timeline component with achievements.
 *
 * This component displays Ayush Rai's professional career journey through an interactive,
 * animated timeline showcasing work experience, achievements, technologies used, and impact metrics.
 * Features responsive design with alternating timeline layout and smooth scroll animations.
 *
 * The component includes:
 * - Interactive professional timeline with company details
 * - Achievement highlights and key accomplishments
 * - Technology skill tags for each role
 * - Responsive alternating timeline design
 * - Performance metrics and success statistics
 * - Visual current position indicators
 *
 * @component
 * @example
 * ```tsx
 * import Experience from './components/Experience';
 *
 * function App() {
 *   return <Experience />;
 * }
 * ```
 *
 * @see {@link src/components/Education.tsx} for academic background
 * @see {@link src/components/Certifications.tsx} for professional credentials
 * @see {@link src/components/Projects.tsx} for project portfolio
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Briefcase, Calendar, MapPin, TrendingUp } from "lucide-react";
import CountUp from "react-countup";

/**
 * Experience — Professional career timeline display component.
 *
 * Renders an interactive timeline of professional experience with animated entries,
 * achievement highlights, and statistical metrics. Provides comprehensive view
 * of career progression, technical skills development, and professional impact.
 *
 * @component
 * @returns {JSX.Element} The rendered Experience section
 *
 * @example
 * ```tsx
 * <Experience />
 * ```
 *
 * @see {@link src/lib/analytics.ts} for integration tracking
 */
const Experience: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const experiences = [
    {
      title: "SDE - AI Engineer",
      company: "FoCDoT Technologies Pvt. Ltd",
      location: "Remote",
      duration: "Apr 2024 - Present",
      type: "Full-time",
      isCurrent: true,
      achievements: [
        "Specialized in Reinforcement Learning from Human Feedback (RLHF)",
        "Collaborated with industry leaders: Turing, OpenAI, ScaleAI, Outlier",
        "Enhanced AI model reliability and performance through STEM analysis",
        "Solved complex coding challenges and optimized ML algorithms",
      ],
      technologies: [
        "Python",
        "RLHF",
        "Machine Learning",
        "AI Development",
        "STEM Analysis",
      ],
    },
    {
      title: "Generative AI Engineer",
      company: "Outlier",
      location: "Remote",
      duration: "Aug 2025 - Present",
      type: "Part-time",
      isCurrent: true,
      achievements: [
        "Developed LLM training datasets and optimization strategies",
        "Implemented advanced prompting strategies for Python/JavaScript",
        "Conducted comprehensive code review, testing, and debugging",
        "Optimized ML frameworks and data preprocessing pipelines",
      ],
      technologies: [
        "Python",
        "JavaScript",
        "LLMs",
        "Prompt Engineering",
        "ML Frameworks",
      ],
    },
    {
      title: "Web Developer",
      company: "RaSoR-IITM",
      location: "Chennai, India",
      duration: "Dec 2023 - Ended",
      type: "Internship",
      isCurrent: false,
      achievements: [
        "Developed responsive web applications for research initiatives",
        "Collaborated with research teams on technical documentation",
        "Implemented modern web technologies and best practices",
        "Maintained and updated existing web platforms",
      ],
      technologies: ["React", "TypeScript", "Node.js", "Web Development"],
    },
    {
      title: "Student Developer Champion",
      company: "UiPath",
      location: "Remote",
      duration: "July 2022 - July 2023",
      type: "Leadership Internship",
      isCurrent: false,
      achievements: [
        "Led community initiatives and technical workshops",
        "Mentored students in automation and RPA technologies",
        "Organized hackathons and coding competitions",
        "Created educational content and tutorials",
      ],
      technologies: [
        "UiPath",
        "RPA",
        "Community Management",
        "Workshop Delivery",
      ],
      link: "https://drive.google.com/file/d/1Nx4TJZIvOUrA12zj0JuXeZGHhDgBDCPp/view?usp=sharing",
    },
    {
      title: "Virtual Intern",
      company: "Salesforce",
      location: "Remote",
      duration: "Oct 2022 - Dec 2022",
      type: "Internship",
      isCurrent: false,
      achievements: [
        "Completed comprehensive CRM and cloud computing projects",
        "Learned Salesforce ecosystem and best practices",
        "Developed custom applications using Salesforce platform",
        "Earned Salesforce platform certifications",
      ],
      technologies: ["Salesforce", "CRM", "Cloud Computing", "Apex"],
      link: "https://drive.google.com/file/d/1WQIAEc7387yi-bh6Eq4LqtCZd4RnGqR7/view?usp=sharing",
    },
    {
      title: "WebOps Member",
      company: "Kanha House, IITM",
      location: "Chennai, India",
      duration: "Sept 2022 - July 2023",
      type: "Part-time",
      isCurrent: false,
      achievements: [
        "Maintained and updated house website and digital infrastructure",
        "Managed social media presence and content creation",
        "Coordinated technical aspects of house events and activities",
        "Implemented digital solutions for community engagement",
      ],
      technologies: [
        "Web Development",
        "Social Media Management",
        "Content Creation",
      ],
      link: "https://drive.google.com/file/d/1Q5uEpe9Q3XrGR_FBpy3pbxzZZRYUk2VG/view?usp=sharing",
    },


  ];

  return (
    <section id="experience" className="py-8 md:py-10 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Professional <span className="text-secondary dark:text-secondary-400">Experience</span>
          </h2>
          <div className="w-20 h-0.5 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Career Journey Across AI, Web Development, and Leadership
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className={`relative mb-6 ${
                index % 2 === 0 ? "md:mr-8" : "md:ml-8 md:text-right"
              } 
                         ${index % 2 === 1 ? "md:pl-8" : ""}`}
            >
              <div
                className={`card max-w-2xl ${
                  index % 2 === 1 ? "md:ml-auto" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <div className="flex items-center mb-1.5 md:mb-0">
                    <Briefcase className="text-accent mr-2" size={18} />
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${
                        exp.type === "Full-time"
                          ? "bg-accent/20 text-accent"
                          : exp.type === "Freelance"
                          ? "bg-secondary/20 text-secondary"
                          : exp.type === "Leadership Internship"
                          ? "bg-tertiary/20 text-purple-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {exp.type}
                    </span>
                  </div>
                  <span className={`font-semibold text-xs ${exp.isCurrent ? 'text-accent' : 'text-gray-600 dark:text-gray-400'}`}>
                    {exp.isCurrent ? 'Current' : 'Ended'}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-1.5 text-gray-800 dark:text-white">
                  {exp.title}
                </h3>
                <p className="text-secondary dark:text-secondary font-semibold mb-2 text-sm">
                  {exp.company}
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-3 text-gray-600 dark:text-gray-400 text-xs">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1.5" />
                    {exp.duration}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={12} className="mr-1.5" />
                    {exp.location}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <TrendingUp size={12} className="mr-1.5 text-accent" />
                    <span className="text-gray-800 dark:text-white font-semibold text-xs">
                      Achievements:
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {exp.achievements.slice(0, 3).map((achievement, achievementIndex) => (
                      <li
                        key={achievementIndex}
                        className="text-gray-700 dark:text-gray-300 flex items-start text-xs"
                      >
                        <span className="text-accent mr-1.5 mt-0.5">•</span>
                        <span className="leading-tight">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <p className="text-gray-800 dark:text-white font-semibold mb-2 text-xs">
                    Technologies:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-primary rounded-md text-xs text-gray-700 dark:text-gray-300 border border-secondary/30 dark:border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {exp.link && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-secondary text-primary rounded-md font-medium hover:bg-secondary/80 transition-colors text-xs"
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      View Resources
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={2} duration={2} delay={0.2} />}
                +
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Years</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={2} duration={2} delay={0.4} />}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Companies</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={3} duration={2} delay={0.6} />}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Industries</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={100} duration={2} delay={0.8} />}
                %
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Success</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
