import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code, Brain, Database, Cloud, Users, Lightbulb } from "lucide-react";

const Skills: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const skillCategories = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      skills: [
        "Python", "RLHF", "LLMs", "PyTorch", "Prompt Engineering"
      ],
      color: "from-accent to-secondary",
    },
    {
      icon: Code,
      title: "Web Development",
      skills: [
        "React", "TypeScript", "Node.js", "JavaScript", "HTML/CSS", "REST APIs"
      ],
      color: "from-secondary to-tertiary",
    },
    {
      icon: Database,
      title: "Data Science",
      skills: [
        "SQL", "Pandas", "NumPy", "Data Visualization", "Statistics", "Tableau"
      ],
      color: "from-tertiary to-accent",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: [
        "AWS", "Git/GitHub", "Docker", "CI/CD", "Linux"
      ],
      color: "from-accent to-secondary",
    },
    {
      icon: Users,
      title: "Leadership",
      skills: [
        "Team Management", "Project Management", "Community Building", "Public Speaking", "Mentoring", "Strategic Planning"
      ],
      color: "from-secondary to-tertiary",
    },
    {
      icon: Lightbulb,
      title: "Creative & Strategic",
      skills: [
        "Problem Solving", "Innovation", "Content Creation", "Design Thinking", "Business Strategy", "Communication"
      ],
      color: "from-tertiary to-accent",
    },
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Multi-Disciplinary <span className="text-secondary dark:text-secondary-400">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technical Expertise Across Multiple Domains
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${category.color}`}>
                <category.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 * categoryIndex + 0.03 * skillIndex,
                    }}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
