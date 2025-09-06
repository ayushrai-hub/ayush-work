import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Calendar, Code, Users, TrendingUp } from 'lucide-react';

const Projects: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const projects = [
    {
      title: "Stock Price Analysis Platform",
      category: "Data Science & Web Development",
      duration: "March - July 2023",
      description: "Comprehensive stock market analysis platform with real-time data visualization, trend analysis, and predictive modeling capabilities.",
      technologies: ["React", "TypeScript", "Python", "Pandas", "Chart.js", "REST APIs"],
      features: [
        "Real-time stock data integration",
        "Interactive charts and visualizations",
        "Technical analysis indicators",
        "Portfolio tracking and management",
        "Responsive design for mobile and desktop"
      ],
      impact: "Enhanced investment decision-making with comprehensive market insights",
      github: "#",
      demo: "#",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg",
      status: "Completed"
    },
    {
      title: "Iha-By-Himani Art Studio Website",
      category: "Web Development & Design",
      duration: "Jan - Feb 2023",
      description: "Modern, responsive website for an art studio showcasing artwork, services, and facilitating client connections.",
      technologies: ["React", "TypeScript", "CSS Modules", "Framer Motion", "Responsive Design"],
      features: [
        "Dynamic portfolio gallery",
        "Smooth animations and transitions",
        "Contact form with email integration",
        "SEO optimization",
        "Mobile-first responsive design"
      ],
      impact: "Increased online presence and client inquiries by 300%",
      github: "#",
      demo: "#",
      image: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg",
      status: "Completed"
    },
    {
      title: "AI-Powered Code Review Assistant",
      category: "AI & Machine Learning",
      duration: "Dec 2024 - Present",
      description: "Intelligent code review system using LLMs to provide automated feedback, bug detection, and optimization suggestions.",
      technologies: ["Python", "LLMs", "Prompt Engineering", "GitHub API", "Flask"],
      features: [
        "Automated code quality analysis",
        "Bug detection and security vulnerabilities",
        "Performance optimization suggestions",
        "Multi-language support",
        "Integration with GitHub workflows"
      ],
      impact: "Reduced code review time by 60% and improved code quality",
      github: "#",
      demo: "#",
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
      status: "In Progress"
    },
    {
      title: "Community Management Dashboard",
      category: "Full-Stack Development",
      duration: "Aug - Nov 2023",
      description: "Comprehensive dashboard for managing online communities with analytics, engagement tracking, and automated moderation.",
      technologies: ["React", "Node.js", "PostgreSQL", "Express", "D3.js", "WebSockets"],
      features: [
        "Real-time analytics and insights",
        "Automated content moderation",
        "Member engagement tracking",
        "Event management system",
        "Social media integration"
      ],
      impact: "Improved community engagement by 150% and reduced moderation time",
      github: "#",
      demo: "#",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
      status: "Completed"
    }
  ];

  return (
    <section id="projects" className="section-padding bg-primary-dark">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Technical Excellence Across Multiple Domains
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${project.status === 'Completed' ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-secondary font-semibold text-sm">{project.category}</span>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar size={16} className="mr-1" />
                  {project.duration}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Code size={16} className="mr-2 text-accent" />
                  <span className="text-white font-semibold">Technologies:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-primary rounded text-xs text-gray-300 border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Users size={16} className="mr-2 text-secondary" />
                  <span className="text-white font-semibold">Key Features:</span>
                </div>
                <ul className="space-y-1">
                  {project.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-400 text-sm flex items-start">
                      <span className="text-accent mr-2 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <TrendingUp size={16} className="mr-2 text-tertiary" />
                  <span className="text-white font-semibold">Impact:</span>
                </div>
                <p className="text-gray-400 text-sm">{project.impact}</p>
              </div>

              <div className="flex gap-4">
                <a
                  href={project.github}
                  className="flex items-center px-4 py-2 bg-primary hover:bg-gray-800 rounded-lg text-white transition-colors"
                >
                  <Github size={16} className="mr-2" />
                  Code
                </a>
                <a
                  href={project.demo}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-accent text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow"
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
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Project Impact</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">15+</div>
              <p className="text-gray-400">Projects Completed</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <p className="text-gray-400">Happy Clients</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <p className="text-gray-400">Success Rate</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-gray-400">Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;