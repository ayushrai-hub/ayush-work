/**
 * Projects.tsx — Featured projects showcase component with live demos and technologies.
 *
 * This comprehensive component displays Ayush Rai's key projects through an interactive
 * card-based layout featuring project descriptions, technologies used, key features, and
 * live demo links. Includes responsive grid design with smooth animations and achievement
 * metrics. Projects span multiple domains including web development, AI, and community platforms.
 *
 * The component includes:
 * - Featured project cards with images and descriptions
 * - Technology stack visualization per project
 * - Live demo and code repository links
 * - Key features and impact metrics
 * - Responsive grid adapting to screen sizes
 * - Professional project statistics
 *
 * Projects showcased:
 * - Overlay Text Box Extension (Browser Extension)
 * - Personal Portfolio Website (Web Development)
 * - Expert-O (AI Innovation Platform)
 * - Shiksha-Mitra (Community Education Platform)
 * - Iha-By-Himani Art Studio Website (Web Design)
 * - Praful H. Professional Website (Enterprise Portfolio & Leadership)
 *
 * @component
 * @example
 * ```tsx
 * import Projects from './components/Projects';
 *
 * function App() {
 *   return <Projects />;
 * }
 * ```
 *
 * @see {@link src/components/Skills.tsx} for technologies overview
 * @see {@link src/components/Experience.tsx} for project context
 * @see {@link src/assets/} for project images
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ExternalLink,
  Github,
  Calendar,
  Code,
  Users,
} from "lucide-react";
import CountUp from "react-countup";
import portfolioImage from "../assets/porfolio.jpeg";
import expertoImage from "../assets/experto.jpeg";
import shikshMitraImage from "../assets/shikshMitra.png";
import ihabyhimaniImage from "../assets/ihabyhimani.jpeg";
import prafulImage from "../assets/prafful.png";

/**
 * Projects — Featured projects portfolio showcase component.
 *
 * Renders an interactive project portfolio with detailed project cards,
 * technology stacks, live demos, and achievement metrics. Provides comprehensive
 * overview of development capabilities across multiple domains and technologies.
 *
 * @component
 * @returns {JSX.Element} The rendered Projects section
 *
 * @example
 * ```tsx
 * <Projects />
 * ```
 *
 * @see {@link src/lib/analytics.ts} for portfolio tracking
 */
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
      demo: "https://ayush-rai-work.netlify.app/",
      image: portfolioImage,
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
      image: expertoImage,
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
      image: shikshMitraImage,
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
      github: "https://github.com/ayushrai-hub/IHA-art-studio",
      demo: "https://www.ihabyhimani.com/",
      image: ihabyhimaniImage,
    },
    {
      title: "Praful H. Professional Website",
      category: "Enterprise Portfolio & Leadership",
      duration: "2024",
      description:
        "A premium professional portfolio website crafted for a UK-based industry leader, showcasing over 17 years of expertise in driving large-scale technology transformation. The site highlights a proven track record in enterprise architecture, digital innovation, and strategic leadership, presented through a refined, modern design. Built with strong emphasis on credibility, performance, and user experience, it effectively communicates the client's achievements, capabilities, and thought leadership within the global technology landscape.",
      technologies: [
        "React",
        "TypeScript",
        "Python",
        "TensorFlow",
        "Next.js",
        "PostgreSQL",
        "Kubernetes",
        "OAuth 2.0",
      ],
      features: [
        "Modern responsive design with mobile-first approach",
        "SEO optimization and performance enhancement",
        "Interactive leadership showcase and achievements timeline",
        "Professional social proof and testimonials integration",
        "Secure contact forms and credential management",
        "Content management system for easy updates",
      ],
      impact:
        "Elevating professional presence and credibility through a high-impact digital portfolio that effectively communicates 17+ years of industry leadership and drives strategic business opportunities",
      github: "https://github.com/ayushrai-hub/client-portfolio-praful",
      demo: "https://praful-h.netlify.app/",
      image: prafulImage,
    },

  ];

  return (
    <section id="projects" className="py-8 md:py-10 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Featured <span className="text-secondary dark:text-secondary-400">Projects</span>
          </h2>
          <div className="w-20 h-0.5 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Technical Excellence Across Multiple Domains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 mb-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card group hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="responsive-img w-full h-24 md:h-28 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary font-semibold text-xs">
                  {project.category}
                </span>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                  <Calendar size={12} className="mr-1" />
                  {project.duration}
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="mb-3">
                <div className="flex items-center mb-1.5">
                  <Code size={12} className="mr-1.5 text-secondary dark:text-accent" />
                  <span className="text-gray-800 dark:text-white font-semibold text-xs">
                    Tech:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-1.5 py-0.5 bg-gray-100 dark:bg-primary rounded-md text-xs text-gray-700 dark:text-gray-300 border border-secondary/30 dark:border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center mb-1.5">
                  <Users size={12} className="mr-1.5 text-secondary dark:text-secondary" />
                  <span className="text-gray-800 dark:text-white font-semibold text-xs">
                    Features:
                  </span>
                </div>
                <ul className="space-y-0.5">
                  {project.features.slice(0, 2).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-gray-600 dark:text-gray-400 text-xs flex items-start"
                    >
                      <span className="text-secondary dark:text-accent mr-1.5 mt-0.5">•</span>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-3">
                <a
                  href={project.github}
                  className="touch-target flex items-center justify-center px-3 py-1.5 bg-gray-800 dark:bg-primary hover:bg-gray-700 dark:hover:bg-gray-700 rounded-md text-white transition-colors text-xs flex-1 shadow-sm"
                >
                  <Github size={12} className="mr-1.5" />
                  Code
                </a>
                <a
                  href={project.demo}
                  className="touch-target flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-secondary to-accent dark:from-secondary dark:to-accent text-primary rounded-md font-medium hover:shadow-md transition-shadow text-xs flex-1"
                >
                  <ExternalLink size={12} className="mr-1.5" />
                  Demo
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6"
        >
          <div className="grid md:grid-cols-4 gap-3 md:gap-4">
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={10} duration={2} delay={0.2} />}
                +
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Projects</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={5} duration={2} delay={0.4} />}
                +
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Clients</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {inView && <CountUp end={100} duration={2} delay={0.6} />}
                %
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Success</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
