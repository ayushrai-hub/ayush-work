import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Microscope, FileText, Users, Calendar, Link, Award, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const Research: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const researchPublications = [
    {
      id: 1,
      title: "Federated Learning for Medical Image Analysis: Privacy-Preserving Deep Learning Models",
      type: "Conference Paper",
      venue: "International Conference on Medical Image Computing and Computer Assisted Intervention (MICCAI)",
      year: "2024",
      status: "Under Review",
      authors: ["Ayush Rai", "Dr. Rajesh Kumar", "Dr. Priya Sharma"],
      abstract: "This paper presents a novel federated learning framework for medical image analysis that preserves patient privacy while maintaining high diagnostic accuracy. The approach utilizes differential privacy techniques combined with model aggregation strategies to create robust diagnostic models.",
      keywords: ["Federated Learning", "Medical Imaging", "Privacy Preservation", "Deep Learning"],
      impact: "Currently under review at MICCAI 2024, a leading conference in medical image computing.",
      links: {
        preprint: "#",
        code: "#",
        dataset: "#"
      }
    },
    {
      id: 2,
      title: "Automated Ensemble Learning Pipeline for Educational Performance Prediction",
      type: "Journal Article",
      venue: "Journal of Educational Data Mining",
      year: "2023",
      status: "Published",
      authors: ["Ayush Rai", "Dr. Ankit Patel"],
      abstract: "Developed an automated machine learning pipeline that combines multiple ensemble techniques to predict student performance. The research demonstrates significant improvements over traditional methods in early warning systems for educational institutions.",
      keywords: ["Ensemble Learning", "Educational Data Mining", "Performance Prediction", "Machine Learning"],
      impact: "Published in Q3 journal, cited in 15+ research papers on educational analytics.",
      citation: "Rai, A., & Patel, A. (2023). Automated Ensemble Learning Pipeline for Educational Performance Prediction. Journal of Educational Data Mining, 12(3), 45-67.",
      links: {
        doi: "https://doi.org/10.1016/j.jedm.2023.03.004",
        fulltext: "#",
        code: "#"
      }
    },
    {
      id: 3,
      title: "Time Series Analysis of Code Review Patterns in Open Source Projects",
      type: "Workshop Paper",
      venue: "International Workshop on Software Engineering Research and Industrial Practice",
      year: "2023",
      status: "Published",
      authors: ["Ayush Rai", "Dr. Meera Singh", "Prof. Ramesh Gupta"],
      abstract: "Comprehensive analysis of code review patterns across 50+ open source projects, examining reviewer behavior, review turnaround times, and code quality correlations.",
      keywords: ["Code Review", "Open Source", "Time Series Analysis", "Software Quality"],
      impact: "Presented at SERIP Workshop co-located with ICSE 2023.",
      citation: "Rai, A., Singh, M., & Gupta, R. (2023). Time Series Analysis of Code Review Patterns in Open Source Projects. In Proceedings of the International Workshop on Software Engineering Research and Industrial Practice.",
      links: {
        pdf: "#",
        slides: "#",
        code: "#"
      }
    },
    {
      id: 4,
      title: "Explainable AI for Regulatory Compliance in Financial Services",
      type: "Working Paper",
      venue: "Indian Institute of Technology Madras",
      year: "2024",
      status: "Working Paper",
      authors: ["Ayush Rai", "Dr. Sameer Jain"],
      abstract: "Investigation into explainable AI techniques for financial regulatory compliance, addressing the black-box nature of deep learning models in sensitive financial applications.",
      keywords: ["Explainable AI", "Financial Regulation", "Compliance", "Deep Learning"],
      impact: "Working paper submitted for journal publication, presented at IIT Madras CS Department seminar.",
      links: {
        workingpaper: "#",
        presentation: "#"
      }
    }
  ];

  const researchProjects = [
    {
      title: "AI-Powered Agricultural Advisory System",
      duration: "Jan 2024 - Present",
      funding: "IIT Madras BS Program",
      description: "Developing an AI system to provide real-time farming recommendations based on satellite imagery, soil sensors, and weather data.",
      technologies: ["Python", "TensorFlow", "Satellite API", "Computer Vision"],
      outcomes: "Prototype deployed for 20+ farmers, 85% prediction accuracy achieved"
    },
    {
      title: "NLP for Legal Document Analysis",
      duration: "Aug 2023 - Dec 2023",
      funding: "LNCT Internal Research Grant",
      description: "Building NLP pipelines for automated analysis of legal contracts and regulatory documents.",
      technologies: ["Python", "Transformers", "Legal NLP", "BERT"],
      outcomes: "Reduced document processing time by 60%, analyzed 10,000+ legal documents"
    },
    {
      title: "Smart Campus Energy Management",
      duration: "Mar 2023 - Aug 2023",
      funding: "BHOPAL SMART CITY INITIATIVE",
      description: "IoT-based energy monitoring and optimization system for university campus buildings.",
      technologies: ["IoT", "Machine Learning", "Sensor Networks", "Web Dashboard"],
      outcomes: "15% energy savings achieved, real-time monitoring dashboard developed"
    }
  ];

  const achievements = [
    {
      title: "Top 5 Finalist - Smart India Hackathon 2024",
      organization: "Ministry of Education, Government of India",
      year: "2024",
      description: "Led a team of 4 developers to build an innovative blockchain-based voting system for secure elections."
    },
    {
      title: "Best Research Paper Award",
      organization: "National Conference on Emerging Technologies",
      year: "2023",
      description: "Honored for paper on Federated Learning applications in healthcare."
    },
    {
      title: "ACM Student Research Competition Finalist",
      organization: "CCSE 2023 Conference",
      year: "2023",
      description: "Selected as one of 20 finalists from 120+ submissions for research presentation."
    }
  ];

  const toggleExpansion = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <section id="research" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Research & <span className="gradient-text">Publications</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Exploring the frontiers of technology through innovative research and scholarly contributions
          </p>
        </motion.div>

        {/* Research Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">8+</div>
            <p className="text-gray-400">Research Projects</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">4</div>
            <p className="text-gray-400">Publications</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">3</div>
            <p className="text-gray-400">Awards & Honors</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">15+</div>
            <p className="text-gray-400">Citations</p>
          </div>
        </motion.div>

        {/* Publications Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Publications</h3>

          <div className="space-y-6">
            {researchPublications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="card"
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleExpansion(pub.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <FileText className="text-accent mr-3" size={20} />
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        pub.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                        pub.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {pub.type}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold mb-2 text-white">{pub.title}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {pub.venue}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {pub.year}
                      </div>
                      <span className={`font-semibold ${
                        pub.status === 'Published' ? 'text-green-400' :
                        pub.status === 'Under Review' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {pub.status}
                      </span>
                    </div>

                    {pub.citation && (
                      <p className="text-sm text-gray-300 italic mb-3">
                        {pub.citation}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pub.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-xs text-accent"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center ml-4">
                    {expandedItem === pub.id ? (
                      <ChevronUp className="text-accent" size={20} />
                    ) : (
                      <ChevronDown className="text-accent" size={20} />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedItem === pub.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-600"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-white mb-2">Abstract</h5>
                        <p className="text-sm text-gray-300">{pub.abstract}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white mb-2">Impact</h5>
                        <p className="text-sm text-gray-300">{pub.impact}</p>

                        <div className="mt-4">
                          <h5 className="font-semibold text-white mb-2">Links</h5>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(pub.links).map(([key, url]) => (
                              url && (
                                <a
                                  key={key}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-primary-dark border border-accent/20 rounded text-xs text-accent hover:bg-accent/10 transition-colors"
                                >
                                  <Link size={12} className="mr-1" />
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Research Projects</h3>

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

                <h4 className="text-lg font-bold mb-2 text-white">{project.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{project.duration}</p>

                <p className="text-sm text-gray-300 mb-4">{project.description}</p>

                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-accent mb-2">Technologies:</h5>
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
                  <p className="text-sm text-green-400 italic">"{project.outcomes}"</p>
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
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Awards & Achievements</h3>

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
                  <span className="text-accent font-bold">{achievement.year}</span>
                </div>

                <h4 className="text-lg font-bold mb-2 text-white">{achievement.title}</h4>
                <p className="text-sm text-secondary mb-3">{achievement.organization}</p>
                <p className="text-sm text-gray-300">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Interest Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center mt-16"
        >
          <div className="bg-glass rounded-2xl p-8 border border-accent/20">
            <BookOpen className="mx-auto mb-4 text-accent" size={48} />
            <h3 className="text-3xl font-bold mb-4 gradient-text">Research Collaboration</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Always looking for research collaborations in AI/ML, privacy-preserving technologies,
              and their real-world applications. Let's discuss potential research partnerships.
            </p>
            <div className="flex justify-center gap-4">
              <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded text-accent font-medium">
                Open to Research Collaborations
              </span>
              <span className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded text-secondary font-medium">
                Joint Publications Welcome
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Research;
