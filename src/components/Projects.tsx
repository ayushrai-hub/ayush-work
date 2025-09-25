import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ExternalLink,
  Github,
  Calendar,
  Code,
  Users,
  TrendingUp,
} from "lucide-react";
import CountUp from "react-countup";

const Projects: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const projects = [
    {
      title: "Overlay Text Box Extension",
      category: "Browser Extension & Web Development",
      duration: "2024 - Present",
      description:
        "A Chrome browser extension that provides an overlay text box to simulate typing into text fields on any webpage. This tool enables users to input text through a clean interface and have it automatically typed character-by-character into target fields, making it ideal for filling out forms with repetitive content, testing user inputs, or avoiding problematic input fields.",
      technologies: [
        "JavaScript",
        "HTML",
        "Chrome Extension API",
        "Manifest V3",
      ],
      features: [
        "Overlay interface with resizable text area",
        "Trigger button next to clicked text fields",
        "Character-by-character typing simulation with random delays",
        "Start/Stop controls for full typing process management",
        "Visual feedback and field disabling during typing",
        "Universal compatibility across all websites",
      ],
      impact:
        "Enhancing user experience for form filling, testing, and accessibility by providing a more comfortable and efficient text input method",
      github: "https://github.com/ayushrai-hub/overlay-text-box-extension",
      demo: "https://github.com/ayushrai-hub/overlay-text-box-extension",
      image: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg",
    },
    {
      title: "Personal Portfolio Website",
      category: "Web Development & Design",
      duration: "2024 - Present",
      description:
        "A modern, single-page personal portfolio website designed to showcase my expertise as a polymath across Generative AI, Web Development, and Data Science. The portfolio includes interactive sections for About Me, Skills, Projects, Education, Experience, Certifications, Blog, and Contact, with a strong focus on performance, accessibility, and SEO. It also integrates animations, dynamic resume downloads, and a serverless contact form to create a professional, engaging, and interactive user experience.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Three.js",
        "Netlify",
      ],
      features: [
        "Interactive portfolio sections",
        "Performance, accessibility, and SEO optimization",
        "Dynamic resume downloads",
        "Serverless contact form",
        "Responsive mobile-first design",
      ],
      impact:
        "Enhancing personal brand through a professional, engaging, and accessible portfolio website",
      github: "https://github.com/ayushrai-hub/ayush-work",
      demo: "https://ayush-me.netlify.app/",
      image: "https://images.pexels.com/photos/12498604/pexels-photo-12498604.jpeg",
    },
    {
      title: "Expert-O",
      category: "AI & Digital Innovation",
      duration: "2024 - Present",
      description:
        "Expert-O is a visionary collective of polymaths in India that blends technology, design, strategy, and AI-driven workflows to deliver transformative digital solutions. It positions itself as an elite tribe of multi-disciplinary innovators who execute 5x faster by leveraging AI augmentation and cross-domain expertise. The platform showcases their mission, values, services, portfolio, pricing models, thought leadership, and recruitment process, with a goal to reshape India's digital future.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Three.js",
        "Vercel",
      ],
      features: [
        "AI-augmented digital solutions",
        "Polymath-driven innovation studio",
        "Comprehensive service portfolio and pricing",
        "Thought leadership content",
        "Streamlined recruitment process",
        "Responsive design with 3D animations",
      ],
      impact:
        "Accelerating India's digital transformation through 5x faster execution and AI-driven innovation",
      github: "https://github.com/ayushrai-hub/ayush-work",
      demo: "https://expert-o.vercel.app/",
      image: "https://images.pexels.com/photos/8100064/pexels-photo-8100064.jpeg",
    },
    {
      title: "Shiksha-Mitra",
      category: "Community & Education Platform",
      duration: "2024 - Present",
      description:
        "Shiksha-Mitra is a collaborative learning and acknowledgement platform designed to help peers support and recognize each other's growth in career and education. It provides an ecosystem where learners, professionals, and mentors can exchange resources, acknowledge progress, and celebrate milestones. The project emphasizes community-driven growth, building a culture of appreciation and collective success in the academic and professional journey.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Firebase",
        "MongoDB",
        "Vercel",
      ],
      features: [
        "Peer learning and mentorship platform",
        "Progress acknowledgement and celebration",
        "Resource sharing ecosystem",
        "Community engagement tools",
        "Collaborative educational environment",
        "Serverless backend for scalability",
      ],
      impact:
        "Fostering community-driven growth and creating a culture of appreciation in education and career development",
      github: "https://github.com/ayushrai-hub/Shiksha-Mitra",
      demo: "https://shiksha-mitra.vercel.app/",
      image: "https://images.pexels.com/photos/1181414/pexels-photo-1181414.jpeg",
    },
    {
      title: "Stock Price Analysis Platform",
      category: "Data Science & Web Development",
      duration: "March - July 2023",
      description:
        "Comprehensive stock market analysis platform with real-time data visualization, trend analysis, and predictive modeling capabilities.",
      technologies: [
        "React",
        "TypeScript",
        "Python",
        "Pandas",
        "Chart.js",
        "REST APIs",
      ],
      features: [
        "Real-time stock data integration",
        "Interactive charts and visualizations",
        "Technical analysis indicators",
        "Portfolio tracking and management",
        "Responsive design for mobile and desktop",
      ],
      impact:
        "Enhanced investment decision-making with comprehensive market insights",
      github: "#",
      demo: "#",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg",
    },
    {
      title: "Iha-By-Himani Art Studio Website",
      category: "Web Development & Design",
      duration: "Jan - Feb 2023",
      description:
        "Modern, responsive website for an art studio showcasing artwork, services, and facilitating client connections.",
      technologies: [
        "React",
        "TypeScript",
        "CSS Modules",
        "Framer Motion",
        "Responsive Design",
      ],
      features: [
        "Dynamic portfolio gallery",
        "Smooth animations and transitions",
        "Contact form with email integration",
        "SEO optimization",
        "Mobile-first responsive design",
      ],
      impact: "Increased online presence and client inquiries by 300%",
      github: "#",
      demo: "#",
      image:
        "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg",
    },

  ];

  return (
    <section id="projects" className="py-12 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Featured <span className="text-secondary dark:text-secondary-400">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technical Excellence Across Multiple Domains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 md:mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="responsive-img w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-secondary font-semibold text-sm">
                  {project.category}
                </span>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Calendar size={16} className="mr-1" />
                  {project.duration}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Code size={16} className="mr-2 text-accent" />
                  <span className="text-gray-800 dark:text-white font-semibold">
                    Technologies:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-primary rounded text-xs text-gray-700 dark:text-gray-300 border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Users size={16} className="mr-2 text-secondary" />
                  <span className="text-gray-800 dark:text-white font-semibold">
                    Key Features:
                  </span>
                </div>
                <ul className="space-y-1">
                  {project.features.slice(0, 3).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-gray-600 dark:text-gray-400 text-sm flex items-start"
                    >
                      <span className="text-accent mr-2 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <TrendingUp size={16} className="mr-2 text-tertiary" />
                  <span className="text-gray-800 dark:text-white font-semibold">Impact:</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.impact}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={project.github}
                  className="touch-target flex items-center justify-center px-4 py-2 bg-gray-800 dark:bg-primary hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg text-white transition-colors text-sm"
                >
                  <Github size={16} className="mr-2" />
                  Code
                </a>
                <a
                  href={project.demo}
                  className="touch-target flex items-center justify-center px-4 py-2 bg-gradient-to-r from-secondary to-accent text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Live Demo
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
            Project Impact
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {inView && <CountUp end={20} duration={2} delay={0.2} />}
                +
              </div>
              <p className="text-gray-600 dark:text-gray-400">Projects Completed</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {inView && <CountUp end={10} duration={2} delay={0.4} />}
                +
              </div>
              <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {inView && <CountUp end={100} duration={2} delay={0.6} />}
                %
              </div>
              <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-400">Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
