import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code, Brain, Database, Cloud, Users, Lightbulb } from "lucide-react";
import SkillsRadarChart from "./SkillsRadarChart";

const Skills: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const skillCategories = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      skills: [
        "Python", "RLHF", "LLMs", "TensorFlow", "PyTorch", "Prompt Engineering"
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
        "Google Cloud", "AWS", "Git/GitHub", "Docker", "CI/CD", "Linux"
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
    <section id="skills" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Multi-Disciplinary <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Technical Expertise Across Multiple Domains
          </p>
        </motion.div>

        {/* Horizontal Skills Layout */}
        <div className="space-y-6 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              className="bg-primary-dark border border-accent/20 rounded-lg p-4"
            >
              <div className="flex items-center mb-3">
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r ${category.color} rounded-md mr-3`}
                >
                  <category.icon size={16} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    }}
                    className="px-3 py-1 bg-primary rounded-full text-sm text-gray-300 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <SkillsRadarChart />
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
