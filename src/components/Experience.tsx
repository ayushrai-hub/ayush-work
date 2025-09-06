import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Calendar, MapPin, TrendingUp } from 'lucide-react';

const Experience: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const experiences = [
    {
      title: "SDE - AI Engineer",
      company: "FoCDoT Technologies Pvt. Ltd",
      location: "Remote",
      duration: "Apr 2024 - Present",
      type: "Full-time",
      achievements: [
        "Specialized in Reinforcement Learning from Human Feedback (RLHF)",
        "Collaborated with industry leaders: Turing, OpenAI, ScaleAI, Outlier",
        "Enhanced AI model reliability and performance through STEM analysis",
        "Solved complex coding challenges and optimized ML algorithms"
      ],
      technologies: ["Python", "RLHF", "Machine Learning", "AI Development", "STEM Analysis"]
    },
    {
      title: "Generative AI Engineer",
      company: "Outlier",
      location: "Remote",
      duration: "Dec 2024 - Present",
      type: "Freelance",
      achievements: [
        "Developed LLM training datasets and optimization strategies",
        "Implemented advanced prompting strategies for Python/JavaScript",
        "Conducted comprehensive code review, testing, and debugging",
        "Optimized ML frameworks and data preprocessing pipelines"
      ],
      technologies: ["Python", "JavaScript", "LLMs", "Prompt Engineering", "ML Frameworks"]
    },
    {
      title: "Web Developer",
      company: "RaSoR-IITM",
      location: "Chennai, India",
      duration: "Dec 2023 - Present",
      type: "Part-time",
      achievements: [
        "Developed responsive web applications for research initiatives",
        "Collaborated with research teams on technical documentation",
        "Implemented modern web technologies and best practices",
        "Maintained and updated existing web platforms"
      ],
      technologies: ["React", "TypeScript", "Node.js", "Web Development"]
    },
    {
      title: "Student Developer Champion",
      company: "UiPath",
      location: "Remote",
      duration: "July 2022 - July 2023",
      type: "Leadership",
      achievements: [
        "Led community initiatives and technical workshops",
        "Mentored students in automation and RPA technologies",
        "Organized hackathons and coding competitions",
        "Created educational content and tutorials"
      ],
      technologies: ["UiPath", "RPA", "Community Management", "Workshop Delivery"]
    },
    {
      title: "Virtual Intern",
      company: "Salesforce",
      location: "Remote",
      duration: "Oct 2022 - Dec 2022",
      type: "Internship",
      achievements: [
        "Completed comprehensive CRM and cloud computing projects",
        "Learned Salesforce ecosystem and best practices",
        "Developed custom applications using Salesforce platform",
        "Earned Salesforce platform certifications"
      ],
      technologies: ["Salesforce", "CRM", "Cloud Computing", "Apex"]
    },
    {
      title: "WebOps Member",
      company: "Kanha House, IITM",
      location: "Chennai, India",
      duration: "Sept 2022 - July 2023",
      type: "Part-time",
      achievements: [
        "Maintained and updated house website and digital infrastructure",
        "Managed social media presence and content creation",
        "Coordinated technical aspects of house events and activities",
        "Implemented digital solutions for community engagement"
      ],
      technologies: ["Web Development", "Social Media Management", "Content Creation"]
    }
  ];

  return (
    <section id="experience" className="section-padding bg-primary-dark">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Career Journey Across AI, Web Development, and Leadership
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          <div className="timeline-line h-full"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className={`relative mb-16 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8 md:text-right'} 
                         ${index % 2 === 1 ? 'md:pl-8' : ''}`}
            >
              <div className="timeline-dot" style={{ top: '2rem' }}></div>

              <div className={`card max-w-2xl ${index % 2 === 1 ? 'md:ml-auto' : ''} ml-12 md:ml-0`}>
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <Briefcase className="text-accent mr-3" size={24} />
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${exp.type === 'Full-time' ? 'bg-accent/20 text-accent' : 
                        exp.type === 'Freelance' ? 'bg-secondary/20 text-secondary' : 
                        exp.type === 'Leadership' ? 'bg-tertiary/20 text-purple-300' :
                        'bg-gray-500/20 text-gray-300'}`}>
                      {exp.type}
                    </span>
                  </div>
                  <span className="text-accent font-semibold">Current</span>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-white">{exp.title}</h3>
                <p className="text-secondary font-semibold mb-3">{exp.company}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-400 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {exp.duration}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {exp.location}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp size={16} className="mr-2 text-accent" />
                    <span className="text-white font-semibold">Key Achievements:</span>
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="text-gray-300 flex items-start">
                        <span className="text-accent mr-2 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="text-white font-semibold mb-3">Technologies Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-primary rounded-full text-sm text-gray-300 border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Experience Metrics</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">4+</div>
              <p className="text-gray-400">Years Experience</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">6</div>
              <p className="text-gray-400">Companies</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">3</div>
              <p className="text-gray-400">Industries</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;