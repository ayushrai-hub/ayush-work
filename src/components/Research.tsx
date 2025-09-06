import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Microscope, Award } from "lucide-react";

const Research: React.FC = () => {
  const [inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
    <section id="research" className="section-padding">
      <div className="container mx-auto px-4">
        {/* Research Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center gradient-text">
            Research Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <Microscope className="text-secondary mr-3" size={24} />
                  <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-semibold">
                    {project.funding}
                  </span>
                </div>

                <h4 className="text-lg font-bold mb-2 text-white">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-400 mb-3">{project.duration}</p>

                <p className="text-sm text-gray-300 mb-4">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-accent mb-2">
                    Technologies:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-primary-dark rounded text-xs text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-sm text-green-400 italic">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center gradient-text">
            Awards & Achievements
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-3">
                  <Award className="text-accent mr-3" size={20} />
                  <span className="text-accent font-bold">
                    {achievement.year}
                  </span>
                </div>

                <h4 className="text-lg font-bold mb-2 text-white">
                  {achievement.title}
                </h4>
                <p className="text-sm text-secondary mb-3">
                  {achievement.organization}
                </p>
                <p className="text-sm text-gray-300">
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
