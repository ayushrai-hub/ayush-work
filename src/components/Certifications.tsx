/**
 * Certifications.tsx — Professional certifications showcase component.
 *
 * This component displays a comprehensive collection of professional certifications
 * earned across multiple domains including cloud computing, cybersecurity, machine
 * learning, and leadership. Features interactive categorization, verified credentials
 * with links, and achievement statistics.
 *
 * The component includes:
 * - Certification cards with detailed information
 * - Category-based filtering and overview
 * - Verification links to credential sources
 * - Achievement metrics and statistics
 * - Responsive grid layout with animations
 *
 * @component
 * @example
 * ```tsx
 * import Certifications from './components/Certifications';
 *
 * function App() {
 *   return <Certifications />;
 * }
 * ```
 *
 * @see {@link src/components/Experience.tsx} for professional experience
 * @see {@link src/components/Education.tsx} for academic background
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Calendar, ExternalLink, CheckCircle } from "lucide-react";

/**
 * Certifications — Professional certifications display component.
 *
 * Renders an interactive certifications showcase with filtering capabilities,
 * detailed credential information, and achievement metrics. Displays certifications
 * across multiple categories with verification links and enables users to explore
 * professional development journey.
 *
 * @component
 * @returns {JSX.Element} The rendered Certifications section
 *
 * @example
 * ```tsx
 * <Certifications />
 * ```
 *
 * @see {@link src/lib/profilesData.ts} for external profile data
 */
const Certifications: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const certifications = [
    {
      title: "30 Days of Google Cloud",
      issuer: "Google Cloud",
      date: "2020-2024",
      category: "Cloud Computing",
      description: "Comprehensive Google Cloud training and certification program",
      skills: ["Python", "Google Cloud", "ML", "Data Analysis"],
      verified: true,
      link: "https://drive.google.com/file/d/1VCcOhp_OW1qVUVbB5pUadznZuceHxLzF/view?usp=sharing"
    },
    {
      title: "CyberOps Associate",
      issuer: "Cisco Networking Academy",
      date: "4 Jul 2023",
      category: "Cybersecurity",
      description: "Advanced cybersecurity operations and network security certification covering threat analysis, incident response, and network monitoring",
      skills: ["Cyber Security", "Network Security", "Incident Response", "Virtual Machines", "Windows OS", "Linux OS"],
      verified: true,
      link: "https://drive.google.com/file/d/1cYU351AbShDaJlv8z8pAyaV2CmuKMHq9/view?usp=sharing"
    },
    {
      title: "Leadership and Talent Management",
      issuer: "Lakshmi Narain College of Technology & Science, Bhopal",
      date: "11 May, 2021",
      category: "Leadership",
      description: "Professional leadership and talent management training",
      skills: ["Leadership"],
      verified: true,
      link: "https://drive.google.com/file/d/1KLQRhZWKtZP3wUTHWhpk1aBBVOUhiKL-/view"
    },
    {
      title: "Introduction to Machine Learning",
      issuer: "AWS Training & Certification",
      date: "27 April, 2021",
      category: "Machine Learning",
      description: "AWS machine learning fundamentals and implementation",
      skills: ["Machine Learning"],
      verified: true,
      link: "https://drive.google.com/file/d/1LHtAR2zdBEUHYe1oQC_ZNeeO1-UQ4YCQ/view"
    },
    {
      title: "Introduction to Packet Tracer",
      issuer: "Cisco Networking Academy",
      date: "25 Jan 2023",
      category: "Cybersecurity",
      description: "Network simulation and cybersecurity fundamentals using Packet Tracer",
      skills: ["Cyber Security"],
      verified: true,
      link: "https://drive.google.com/file/d/1_CIDIlPRbNR9rhwgaAFLQlRe9rJqC_qN/view?usp=sharing"
    },
    {
      title: "Introduction to Cybersecurity",
      issuer: "Cisco Networking Academy",
      date: "10 Feb 2023",
      category: "Cybersecurity",
      description: "Fundamental cybersecurity principles and practices",
      skills: ["Cyber Security"],
      verified: true,
      link: "https://drive.google.com/file/d/1dR5JkyQiC66W5lu_7c9PJbhNccVoCMDT/view?usp=sharing"
    },
    {
      title: "Foundations: Data, Everywhere",
      issuer: "Coursera",
      date: "4 Mar. 2022",
      category: "Data Science",
      description: "Foundational data science and analytics certification",
      skills: ["Data Science"],
      verified: true,
      link: "https://drive.google.com/file/d/1SdTEH72nLWGtL50vYh_tH7Fhj_JJ881J/view?usp=sharing"
    },
  ];

  const categories = [
    { name: "Cybersecurity", count: 3, color: "bg-red-500/20 text-red-400" },
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
      name: "Data Science",
      count: 1,
      color: "bg-green-500/20 text-green-400",
    },
    { name: "Leadership", count: 1, color: "bg-yellow-500/20 text-yellow-400" },
  ];

  return (
    <section id="certifications" className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            <span className="text-blue-600">Certifications</span> & Achievements
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Continuous Learning and Professional Development
          </p>
        </motion.div>

        {/* Category Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
              <div className="text-4xl font-bold gradient-text mb-2">7</div>
              <p className="text-gray-400">Certifications Earned</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">5</div>
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
