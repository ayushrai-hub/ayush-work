/**
 * Legacy education section: one card per degree with institution, dates, grade, and coursework tags.
 *
 * Legacy: not imported by the current site (src/App.tsx routes use src/pages).
 * Kept for reference; excluded from tsconfig.app.json. Covered only by
 * src/__tests__/legacy/Education.test.tsx, which Vitest excludes.
 *
 * Entries are hard-coded and laid out in an alternating left/right column on
 * medium screens. The current site's education facts live in src/content/.
 *
 * Connects to:
 * - No importers in src/
 * - framer-motion, react-intersection-observer, lucide-react
 */
 import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";

/**
 * Renders `<section id="education">`. The badge text comes from each entry's
 * `type` ("primary", "secondary", or "foundation"), and the grade shows `cgpa`
 * when present, otherwise `percentage`. At most six coursework tags are shown.
 */
const Education: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const education = [
    {
      degree: "B.Tech Computer Science Engineering",
      institution: "Lakshmi Narain College of Technology and Science, Bhopal",
      duration: "Sept 2020 - July 2024",
      cgpa: "8.47/10.0",
      coursework: [
        "Operating Systems",
        "Database Management Systems",
        "Computer Networks",
        "Data Structures & Algorithms",
        "Software Engineering",
        "Computer Architecture",
      ],
      type: "primary",
    },
    {
      degree: "BS Data Science and Applications",
      institution: "Indian Institute of Technology, Madras",
      duration: "2021-2024",
      cgpa: "6.86/10.0",
      coursework: [
        "Statistics",
        "Computational Thinking",
        "DBMS",
        "Advanced Mathematics",
        "Machine Learning",
        "Data Analytics",
      ],
      type: "secondary",
    },
    {
      degree: "Higher Secondary (PCM)",
      institution: "Mission English Higher Secondary School, Seoni",
      duration: "2019-2020",
      percentage: "78.2%",
      coursework: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "English",
        "Computer Science",
      ],
      type: "foundation",
    },
  ];

  return (
    <section id="education" className="py-8 md:py-10 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            <span className="text-blue-600">Education</span>
          </h2>
          <div className="w-20 h-0.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Academic Excellence & Continuous Learning Journey
          </p>
        </motion.div>

        <div className="relative">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
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
                <div className="flex items-center mb-3">
                  <GraduationCap className="text-secondary dark:text-accent mr-2" size={18} />
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${
                      edu.type === "primary"
                        ? "bg-accent/20 dark:bg-accent/20 text-accent dark:text-accent"
                        : edu.type === "secondary"
                        ? "bg-secondary/20 dark:bg-secondary/20 text-secondary dark:text-secondary"
                        : "bg-tertiary/20 dark:bg-tertiary/20 text-tertiary dark:text-purple-300"
                    }`}
                  >
                    {edu.type === "primary"
                      ? "Primary Degree"
                      : edu.type === "secondary"
                      ? "Parallel Degree"
                      : "Foundation"}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-1.5 text-gray-800 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-secondary dark:text-secondary font-semibold mb-2 text-sm">
                  {edu.institution}
                </p>

                <div className="grid md:grid-cols-2 gap-2 mb-3 text-gray-600 dark:text-gray-400 text-xs">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1.5" />
                    {edu.duration}
                  </div>
                  <div className="flex items-center">
                    <Award size={12} className="mr-1.5" />
                    {edu.cgpa || edu.percentage}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    <BookOpen size={12} className="mr-1.5 text-secondary dark:text-accent" />
                    <span className="text-gray-800 dark:text-white font-semibold text-xs">
                      Coursework:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.slice(0, 6).map((course, courseIndex) => (
                      <span
                        key={courseIndex}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-primary-dark rounded-md text-xs text-gray-700 dark:text-gray-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Education;
