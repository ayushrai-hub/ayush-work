import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Calendar, ExternalLink, CheckCircle } from "lucide-react";

const Certifications: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const certifications = [
    {
      title: "CyberOps Associate",
      issuer: "Cisco Networking Academy",
      date: "2022",
      category: "Cybersecurity",
      description:
        "Comprehensive cybersecurity operations and incident response certification",
      skills: [
        "Network Security",
        "Threat Detection",
        "Incident Response",
        "Security Operations",
      ],
      verified: true,
    },
    {
      title: "30 Days of Google Cloud Challenge",
      issuer: "Google Cloud",
      date: "2021",
      category: "Cloud Computing",
      description:
        "Hands-on cloud computing and services implementation challenge",
      skills: [
        "Google Cloud Platform",
        "Cloud Architecture",
        "DevOps",
        "Serverless Computing",
      ],
      verified: true,
    },
    {
      title: "Foundations: Data, Everywhere",
      issuer: "Coursera (Google)",
      date: "2022",
      category: "Data Analysis",
      description: "Foundational data analysis and visualization certification",
      skills: ["Data Analysis", "Data Visualization", "SQL", "Spreadsheets"],
      verified: true,
    },
    {
      title: "Introduction to Machine Learning",
      issuer: "AWS",
      date: "2021",
      category: "Machine Learning",
      description:
        "Introduction to ML concepts and AWS machine learning services",
      skills: ["Machine Learning", "AWS ML Services", "Data Science", "Python"],
      verified: true,
    },
    {
      title: "Git from Basics to Advanced",
      issuer: "Udemy",
      date: "2022",
      category: "Development Tools",
      description: "Comprehensive version control and collaboration with Git",
      skills: ["Git", "GitHub", "Version Control", "Collaboration"],
      verified: true,
    },
    {
      title: "Leadership and Talent Management",
      issuer: "Professional Development",
      date: "2021",
      category: "Leadership",
      description: "Strategic leadership and team management certification",
      skills: [
        "Leadership",
        "Team Management",
        "Strategic Planning",
        "Talent Development",
      ],
      verified: true,
    },
    {
      title: "Digital 101",
      issuer: "FutureSkills Prime",
      date: "2021",
      category: "Digital Skills",
      description: "Digital literacy and emerging technology fundamentals",
      skills: [
        "Digital Literacy",
        "Emerging Technologies",
        "Innovation",
        "Digital Transformation",
      ],
      verified: true,
    },
    {
      title: "Introduction to Cyber Security",
      issuer: "Cisco Networking Academy",
      date: "2021",
      category: "Cybersecurity",
      description: "Fundamental cybersecurity principles and best practices",
      skills: [
        "Cybersecurity Fundamentals",
        "Network Security",
        "Security Policies",
        "Risk Management",
      ],
      verified: true,
    },
  ];

  const categories = [
    { name: "Cybersecurity", count: 2, color: "bg-red-500/20 text-red-400" },
    {
      name: "Cloud Computing",
      count: 1,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Machine Learning",
      count: 1,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      name: "Data Analysis",
      count: 1,
      color: "bg-green-500/20 text-green-400",
    },
    { name: "Leadership", count: 1, color: "bg-yellow-500/20 text-yellow-400" },
    {
      name: "Development Tools",
      count: 1,
      color: "bg-pink-500/20 text-pink-400",
    },
    {
      name: "Digital Skills",
      count: 1,
      color: "bg-indigo-500/20 text-indigo-400",
    },
  ];

  return (
    <section id="certifications" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Certifications</span> & Achievements
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Continuous Learning and Professional Development
          </p>
        </motion.div>

        {/* Category Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
            Certification Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                className={`px-4 py-2 rounded-full ${category.color} font-medium`}
              >
                {category.name} ({category.count})
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card hover:border-accent/40 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Award className="text-accent mr-3" size={24} />
                  {cert.verified && (
                    <CheckCircle className="text-green-400" size={20} />
                  )}
                </div>
                <span className="text-xs text-gray-400 px-2 py-1 bg-primary-dark rounded">
                  {cert.category}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
                {cert.title}
              </h3>
              <p className="text-secondary font-semibold mb-2">{cert.issuer}</p>

              <div className="flex items-center mb-3 text-gray-400 text-sm">
                <Calendar size={16} className="mr-2" />
                {cert.date}
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {cert.description}
              </p>

              <div className="mb-4">
                <p className="text-white font-semibold mb-2 text-sm">
                  Skills Covered:
                </p>
                <div className="flex flex-wrap gap-1">
                  {cert.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-primary-dark rounded text-xs text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <button className="flex items-center text-accent hover:text-secondary transition-colors text-sm">
                  <ExternalLink size={16} className="mr-2" />
                  Verify Certificate
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
            Achievement Timeline
          </h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-secondary to-accent h-full"></div>

            {["2021", "2022", "2023", "2024"].map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className={`flex items-center mb-8 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                  }`}
                >
                  <div className="card">
                    <h4 className="text-xl font-bold mb-2 gradient-text">
                      {year}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {year === "2021" &&
                        "Started certification journey with Google Cloud and AWS"}
                      {year === "2022" &&
                        "Advanced in cybersecurity and data analysis"}
                      {year === "2023" &&
                        "Focused on leadership and advanced technical skills"}
                      {year === "2024" &&
                        "Specialized in AI/ML and continued professional development"}
                    </p>
                  </div>
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 bg-accent rounded-full border-4 border-primary"></div>
                </div>
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certification Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
            Learning Impact
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">8+</div>
              <p className="text-gray-400">Certifications Earned</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">7</div>
              <p className="text-gray-400">Skill Categories</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <p className="text-gray-400">Verified Credentials</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">4</div>
              <p className="text-gray-400">Years Learning</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
