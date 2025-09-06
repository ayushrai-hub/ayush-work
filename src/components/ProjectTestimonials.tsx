import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Star, ArrowLeft, ArrowRight, User, Calendar, Building } from 'lucide-react';

const ProjectTestimonials: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      position: "CEO",
      company: "IndiaAgriTech Solutions",
      project: "AI-Powered Agricultural Advisory System",
      content: "Ayush delivered an exceptional AI system that revolutionized our farming operations. The predictive analytics are incredibly accurate, with results exceeding our expectations by 25%. The platform's user interface is intuitive and the technical implementation is flawless.",
      rating: 5,
      date: "March 2024",
      impact: "85% increase in crop yield prediction accuracy",
      image: "https://images.pexels.com/photos/3184395/pexels-photo-3184395.jpeg"
    },
    {
      id: 2,
      name: "Rahul Verma",
      position: "CTO",
      company: "FinTech Innovations Pvt. Ltd.",
      project: "Stock Price Analysis Platform",
      content: "Working with Ayush was a game-changer for our investment platform. His technical expertise in real-time data processing and visualization created a system that handles millions of data points seamlessly. The predictive models are remarkably accurate.",
      rating: 5,
      date: "August 2023",
      impact: "60% improvement in user engagement, 40% increase in platform usage",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg"
    },
    {
      id: 3,
      name: "Ms. Himani Rathore",
      position: "Founder & Artist",
      company: "Iha-By-Himani Art Studio",
      project: "Modern Art Portfolio Website",
      content: "Ayush transformed my art business completely. The website he created not only showcases my work beautifully but also increased my client inquiries by 300%. His understanding of both design and technical implementation is outstanding.",
      rating: 5,
      date: "February 2023",
      impact: "300% increase in client inquiries, 150% boost in online sales",
      image: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg"
    },
    {
      id: 4,
      name: "Dr. Amit Kumar",
      position: "Head of Technology",
      company: "EduTech Solutions",
      project: "AI ML Education Dashboard",
      content: "Ayush's expertise in educational technology is unparalleled. The system he developed for us not only improved student outcomes by 35% but also provided valuable insights for our curriculum development. His commitment to excellence is evident in every detail.",
      rating: 5,
      date: "November 2023",
      impact: "35% improvement in student learning outcomes",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
    },
    {
      id: 5,
      name: "Sandeep Jain",
      position: "Managing Director",
      company: "Smart City Bhopal Initiative",
      project: "IoT Energy Management System",
      content: "Ayush designed and implemented a sophisticated IoT system that optimized our university's energy consumption. The 15% energy savings were just the beginning - the system's scalability and real-time monitoring capabilities have made it invaluable for our operations.",
      rating: 5,
      date: "May 2023",
      impact: "15% reduction in energy consumption, $50K annual savings",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
    },
    {
      id: 6,
      name: "Lisa Chen",
      position: "Senior Manager",
      company: "Taiwan Tech Exchange Program",
      project: "Cross-cultural Tech Innovation Summit",
      content: "Ayush's leadership in organizing the Taiwan-India Tech Summit was exemplary. His ability to bridge cultural differences while delivering technical excellence created an environment of genuine collaboration and innovation.",
      rating: 5,
      date: "December 2023",
      impact: "$50K+ in successful cross-border partnerships",
      image: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
    }
  ];

  const projectStats = [
    {
      label: "Client Satisfaction",
      value: "98%",
      description: "Average client satisfaction rating"
    },
    {
      label: "Projects Delivered",
      value: "15+",
      description: "Successfully completed projects"
    },
    {
      label: "On-Time Delivery",
      value: "100%",
      description: "Projects delivered on schedule"
    },
    {
      label: "Return on Investment",
      value: "300%",
      description: "Average ROI for clients"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real results and success stories from collaborative projects
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {projectStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="card text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
              <p className="text-gray-400 text-xs">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative bg-gradient-to-r from-primary via-primary-dark to-primary rounded-3xl p-8 md:p-12 border border-accent/20">
            {/* Header with Project Info */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Project: {currentTestimonial.project}</h3>
                <div className="flex items-center text-secondary">
                  <Calendar size={16} className="mr-2" />
                  {currentTestimonial.date}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex mb-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm">{currentTestimonial.rating}/5 Rating</p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="mb-8">
              <Quote className="text-accent mb-4" size={48} />
              <blockquote className="text-lg text-gray-300 leading-relaxed italic mb-6">
                "{currentTestimonial.content}"
              </blockquote>
              <div className="text-accent font-semibold text-sm">
                💡 Impact: {currentTestimonial.impact}
              </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mr-4">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{currentTestimonial.name}</h4>
                  <p className="text-gray-400">{currentTestimonial.position}</p>
                  <div className="flex items-center text-sm text-secondary">
                    <Building size={14} className="mr-1" />
                    {currentTestimonial.company}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevTestimonial}
                className="flex items-center px-4 py-2 bg-primary-dark border border-accent/20 rounded-lg text-accent hover:border-accent hover:bg-accent/10 transition-all"
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-accent' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="flex items-center px-4 py-2 bg-primary-dark border border-accent/20 rounded-lg text-accent hover:border-accent hover:bg-accent/10 transition-all"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid of All Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              className={`card cursor-pointer transition-all hover:scale-105 ${
                index === currentIndex ? 'ring-2 ring-accent border-accent' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-semibold">
                    {testimonial.date}
                  </span>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">{testimonial.name}</h4>
                <p className="text-gray-400 text-xs mb-3">{testimonial.position} at {testimonial.company}</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{testimonial.content.substring(0, 120)}..."
                </p>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="text-green-400 text-xs font-semibold">
                  📈 {testimonial.impact}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mt-16"
        >
          <div className="bg-glass rounded-2xl p-8 border border-accent/20">
            <h3 className="text-3xl font-bold mb-4 gradient-text">Ready to Start Your Project?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join our satisfied clients who have transformed their businesses with innovative technology solutions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-6 py-3 bg-accent/10 border border-accent/20 rounded-full text-accent font-medium">
                100% Client Satisfaction Rate
              </span>
              <span className="px-6 py-3 bg-secondary/10 border border-secondary/20 rounded-full text-secondary font-medium">
                Proven Track Record
              </span>
              <span className="px-6 py-3 bg-tertiary/10 border border-tertiary/20 rounded-full text-purple-400 font-medium">
                Measurable Results
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectTestimonials;
