import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Brain, Database, Cloud, Users, Lightbulb } from 'lucide-react';

const Skills: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const skillCategories = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      skills: [
        { name: "Python", level: 90 },
        { name: "RLHF", level: 85 },
        { name: "LLMs", level: 88 },
        { name: "TensorFlow", level: 75 },
        { name: "PyTorch", level: 80 },
        { name: "Prompt Engineering", level: 92 }
      ],
      color: "from-accent to-secondary"
    },
    {
      icon: Code,
      title: "Web Development",
      skills: [
        { name: "React", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Node.js", level: 82 },
        { name: "JavaScript", level: 90 },
        { name: "HTML/CSS", level: 95 },
        { name: "REST APIs", level: 88 }
      ],
      color: "from-secondary to-tertiary"
    },
    {
      icon: Database,
      title: "Data Science",
      skills: [
        { name: "SQL", level: 88 },
        { name: "Pandas", level: 85 },
        { name: "NumPy", level: 80 },
        { name: "Data Visualization", level: 82 },
        { name: "Statistics", level: 78 },
        { name: "Tableau", level: 75 }
      ],
      color: "from-tertiary to-accent"
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: [
        { name: "Google Cloud", level: 75 },
        { name: "AWS", level: 70 },
        { name: "Git/GitHub", level: 90 },
        { name: "Docker", level: 65 },
        { name: "CI/CD", level: 68 },
        { name: "Linux", level: 72 }
      ],
      color: "from-accent to-secondary"
    },
    {
      icon: Users,
      title: "Leadership",
      skills: [
        { name: "Team Management", level: 90 },
        { name: "Project Management", level: 85 },
        { name: "Community Building", level: 92 },
        { name: "Public Speaking", level: 80 },
        { name: "Mentoring", level: 88 },
        { name: "Strategic Planning", level: 82 }
      ],
      color: "from-secondary to-tertiary"
    },
    {
      icon: Lightbulb,
      title: "Creative & Strategic",
      skills: [
        { name: "Problem Solving", level: 95 },
        { name: "Innovation", level: 88 },
        { name: "Content Creation", level: 82 },
        { name: "Design Thinking", level: 78 },
        { name: "Business Strategy", level: 75 },
        { name: "Communication", level: 90 }
      ],
      color: "from-tertiary to-accent"
    }
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

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              className="card"
            >
              <div className="flex items-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg mr-4`}>
                  <category.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-accent font-semibold">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-progress"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Expertise Highlights</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10+</div>
              <p className="text-gray-400">Technologies Mastered</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">6</div>
              <p className="text-gray-400">Skill Categories</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">4+</div>
              <p className="text-gray-400">Years Learning</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">∞</div>
              <p className="text-gray-400">Continuous Growth</p>
            </div>
          </div>
        </motion.div>

        {/* Areas of Active Learning */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Currently Learning</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Advanced Deep Learning",
              "Blockchain Technology",
              "Mobile App Development",
              "Digital Marketing",
              "Business Strategy",
              "Entrepreneurship",
              "Space Technology",
              "Quantum Computing"
            ].map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.05 }}
                className="px-4 py-2 bg-gradient-to-r from-secondary/20 to-accent/20 border border-accent/30 rounded-full text-white font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;