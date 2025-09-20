'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Calendar,
  Github,
  Linkedin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { trackContactForm, trackServiceInterest } from "../lib/analytics";

const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Track service interest when user selects a service
    if (name === "service" && value) {
      // Wait a bit to avoid tracking incomplete selections
      setTimeout(() => {
        if (formData.service === value) {
          // Ensure it hasn't changed
          trackServiceInterest(value);
        }
      }, 1000);
    }

    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleFormFocus = () => {
    // Track when user starts interacting with the form
    if (
      !formData.name &&
      !formData.email &&
      !formData.subject &&
      !formData.message
    ) {
      trackContactForm("start");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Track form submission
    trackContactForm("submit");

    await submitForm();
  };

  const submitForm = async () => {
    try {
      // Prepare form data for Formspree
      const formDataToSend = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        service: formData.service,
      };

      const response = await fetch("https://formspree.io/f/mandaogr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok || result.success) {
          setSubmitStatus({ type: "success", message: "Thank you! Your message has been sent successfully. I'll get back to you soon." });
          // Track successful form submission
          trackContactForm("success");
          // Clear form on success
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            service: "",
          });
        } else {
          setSubmitStatus({ type: "error", message: result.message || "Failed to send message. Please try again." });
          // Track form error
          trackContactForm("error");
        }
      } else if (response.status === 429) {
        setSubmitStatus({ type: "error", message: "Too many requests. Please try again later." });
        trackContactForm("error");
      } else if (response.status === 400) {
        setSubmitStatus({ type: "error", message: "Failed to send message (400). Please try again." });
        trackContactForm("error");
      } else {
        setSubmitStatus({ type: "error", message: `Failed to send message (${response.status}). Please try again.` });
        // Track form error
        trackContactForm("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your internet connection and try again.",
      });
      // Track form error
      trackContactForm("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    submitForm();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "ayushrai0211@gmail.com",
      link: "mailto:ayushrai0211@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91-7440567944",
      link: "tel:+917440567944",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Bhopal, India (Remote Available)",
      link: "#",
    },
    {
      icon: MessageCircle,
      title: "Response Time",
      value: "Within 24 hours",
      link: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      name: "GitHub",
      url: "https://github.com/ayushrai-hub",
      handle: "@ayushrai-hub",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: "https://linkedin.com/in/ayushrai02",
      handle: "@ayushrai02",
    },
    {
      icon: Mail,
      name: "Email",
      url: "mailto:ayushrai0211@gmail.com",
      handle: "ayushrai0211@gmail.com",
    },
  ];

  return (
    <section id="contact" className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Let's Work <span className="text-blue-600">Together</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and
            create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">
              Get In Touch
            </h3>

            <div className="space-y-4 mb-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-center group"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-lg mr-3 group-hover:scale-110 transition-transform">
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
              className="bg-glass rounded-xl p-4 border border-accent/20 mb-6"
            >
              <h4 className="text-lg font-bold mb-3 text-accent">
                Current Availability
              </h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-green-400">
                    Available for new projects
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                  <span className="text-blue-400">
                    Open to full-time opportunities
                  </span>
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
              className="mb-6"
            >
              <h4 className="text-lg font-bold mb-4 text-white">
                Connect With Me
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-primary-dark border border-accent/20 rounded-lg hover:border-accent hover:bg-accent/10 transition-all group"
                    whileHover={{ scale: 1.1 }}
                    title={social.name}
                  >
                    <social.icon
                      size={20}
                      className="text-gray-400 group-hover:text-accent transition-colors"
                    />
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
              <h3 className="text-xl font-bold mb-4 text-white">
                Send Me a Message
              </h3>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-300 text-base font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={handleFormFocus}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white text-base touch-target"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-300 text-base font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white text-base touch-target"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-gray-300 text-base font-medium mb-2"
                    >
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white text-base touch-target"
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
                    <label
                      htmlFor="subject"
                      className="block text-gray-300 text-base font-medium mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white text-base touch-target"
                      autoComplete="subject"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-300 text-base font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg focus:border-accent focus:outline-none text-white text-base resize-none touch-target"
                      autoComplete="message"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Status Message */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start p-4 rounded-lg ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle
                        className="text-green-400 mr-3 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                    ) : (
                      <AlertCircle
                        className="text-red-400 mr-3 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          submitStatus.type === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {submitStatus.message}
                      </p>
                      {submitStatus.type === "error" && (
                        <button
                          type="button"
                          onClick={handleRetry}
                          disabled={isSubmitting}
                          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full touch-target bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send
                        size={20}
                        className="mr-2 group-hover:translate-x-1 transition-transform"
                      />
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
          className="text-center mt-10"
        >
          <div className="bg-glass rounded-xl p-6 border border-accent/20">
            <h3 className="text-2xl font-bold mb-3 gradient-text">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-400 text-sm mb-5 max-w-2xl mx-auto">
              I'm here to help you turn your ideas into reality. Whether you
              need AI solutions, web development, or strategic consultation,
              let's discuss how we can work together.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="mailto:ayushrai0211@gmail.com" className="touch-target btn-primary text-sm px-4 py-3 flex items-center justify-center">
                <Mail size={16} className="mr-1.5" />
                Email Me
              </a>
              <a href="tel:+917440567944" className="touch-target btn-secondary text-sm px-4 py-3 flex items-center justify-center">
                <Phone size={16} className="mr-1.5" />
                Call Now
              </a>
              <a href="https://calendly.com/ayushrai0211" target="_blank" rel="noopener noreferrer" className="touch-target btn-secondary text-sm px-4 py-3 flex items-center justify-center">
                <Calendar size={16} className="mr-1.5" />
                Schedule Call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
