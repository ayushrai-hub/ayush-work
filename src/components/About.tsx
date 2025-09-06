import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Code, Users, Lightbulb } from "lucide-react";

const About: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const values = [
    {
      icon: Brain,
      title: "Strategic Thinking",
      description:
        "Approaching complex problems with analytical depth and strategic foresight across multiple disciplines.",
    },
    {
      icon: Code,
      title: "Technical Innovation",
      description:
        "Leveraging cutting-edge technologies to create scalable solutions that drive meaningful impact.",
    },
    {
      icon: Users,
      title: "Community Leadership",
      description:
        "Building and nurturing communities while mentoring others in their technical and professional growth.",
    },
    {
      icon: Lightbulb,
      title: "Continuous Learning",
      description:
        "Embracing the polymath mindset with insatiable curiosity and commitment to lifelong learning.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-primary-dark">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The Polymath's Journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6 gradient-text">My Story</h3>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                I'm a technology enthusiast with a unique blend of technical
                expertise and strategic thinking. Currently pursuing dual
                degrees in Computer Science Engineering and Data Science from
                IIT Madras, I believe in the power of interdisciplinary
                knowledge.
              </p>
              <p>
                My journey spans across AI/ML development, full-stack web
                development, data science, and community leadership. As an SDE -
                AI Engineer at FoCDoT Technologies, I specialize in
                Reinforcement Learning from Human Feedback (RLHF) and work with
                industry leaders like OpenAI, ScaleAI, and Outlier.
              </p>
              <p>
                What drives me is the intersection of technology and human
                impact. Whether it's optimizing AI models, building scalable web
                applications, or leading technical communities, I approach every
                challenge with strategic thinking and execution excellence.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-glass rounded-2xl p-8 border border-accent/20">
              <h4 className="text-2xl font-bold mb-4 text-accent">
                Personal Philosophy
              </h4>
              <blockquote className="text-gray-300 italic text-lg leading-relaxed">
                "Technology should amplify human potential, not replace it. As a
                polymath, I bridge the gap between different domains to create
                holistic solutions that address real-world challenges."
              </blockquote>
              <cite className="block mt-4 text-secondary font-semibold">
                - Ayush Rai
              </cite>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">
            Core Values & Approach
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="card text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full mb-4">
                  <value.icon size={32} className="text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">
                  {value.title}
                </h4>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
