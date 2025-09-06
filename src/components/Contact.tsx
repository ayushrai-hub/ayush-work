import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, MessageCircle, Calendar, Github, Linkedin, CheckCircle, AlertCircle } from 'lucide-react';
import EmailService from '../lib/emailService';
import { trackContactForm, trackServiceInterest } from '../lib/analytics';

const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Track service interest when user selects a service
    if (name === 'service' && value) {
      // Wait a bit to avoid tracking incomplete selections
      setTimeout(() => {
        if (formData.service === value) { // Ensure it hasn't changed
          trackServiceInterest(value);
        }
      }, 1000);
    }

    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleFormFocus = () => {
    // Track when user starts interacting with the form
    if (!formData.name && !formData.email && !formData.subject && !formData.message) {
      trackContactForm('start');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Track form submission
    trackContactForm('submit');

    try {
      const result = await EmailService.sendContactEmail(formData);

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        // Track successful form submission
        trackContactForm('success');
        // Clear form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          service: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
        // Track form error
        trackContactForm('error');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.'
      });
      // Track form error
      trackContactForm('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "ayushrai0211@gmail.com",
      link: "mailto:ayushrai0211@gmail.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91-7440567944",
      link: "tel:+917440567944"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Bhopal, India (Remote Available)",
      link: "#"
    },
    {
      icon: MessageCircle,
      title: "Response Time",
      value: "Within 24 hours",
      link: "#"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      name: "GitHub",
      url: "https://github.com/ayushrai-hub",
      handle: "@ayushrai-hub"
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: "https://linkedin.com/in/ayushrai02",
      handle: "@ayushrai02"
    },
    {
      icon: Mail,
      name: "Email",
      url: "mailto:ayushrai0211@gmail.com",
      handle: "ayushrai0211@gmail.com"
    }
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-8 gradient-text">Get In Touch</h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-center group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <info.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{info.title}</h4>
                    <a 
                      href={info.link}
                      className="text-gray-400 hover:text-accent transition-colors"
                    >
                      {info.value}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-glass rounded-2xl p-6 border border-accent/20 mb-8"
            >
              <h4 className="text-xl font-bold mb-4 text-accent">Current Availability</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                  <span className="text-green-400">Available for new projects</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                  <span className="text-blue-400">Open to full-time opportunities</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
                  <span className="text-yellow-400">Quick response time</span>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h4 className="text-xl font-bold mb-4 text-white">Connect With Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-primary-dark border border-accent/20 rounded-lg hover:border-accent hover:bg-accent/10 transition-all group"
                    whileHover={{ scale: 1.1 }}
                    title={social.name}
                  >
                    <social.icon size={20} className="text-gray-400 group-hover:text-accent transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="card">
              <h3 className="text-2xl font-bold mb-6 text-white">Send Me a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={handleFormFocus}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-gray-300 font-medium mb-2">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white"
                  >
                    <option value="">Select a service</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="web-dev">Web Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="consultation">Technical Consultation</option>
                    <option value="community">Community Management</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-300 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-300 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Status Message */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center p-4 rounded-lg ${
                      submitStatus.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="text-green-400 mr-3 flex-shrink-0" size={20} />
                    ) : (
                      <AlertCircle className="text-red-400 mr-3 flex-shrink-0" size={20} />
                    )}
                    <p className={`text-sm ${
                      submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {submitStatus.message}
                    </p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-8 py-3 bg-gradient-to-r from-secondary to-accent text-primary font-semibold rounded-lg hover:shadow-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="bg-glass rounded-2xl p-8 border border-accent/20">
            <h3 className="text-3xl font-bold mb-4 gradient-text">Ready to Start Your Project?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              I'm here to help you turn your ideas into reality. Whether you need AI solutions, 
              web development, or strategic consultation, let's discuss how we can work together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:ayushrai0211@gmail.com" className="btn-primary">
                <Mail size={20} className="mr-2" />
                Email Me
              </a>
              <a href="tel:+917440567944" className="btn-secondary">
                <Phone size={20} className="mr-2" />
                Call Now
              </a>
              <button className="btn-secondary">
                <Calendar size={20} className="mr-2" />
                Schedule Call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
