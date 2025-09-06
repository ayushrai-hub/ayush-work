import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Brain, BarChart3, Users, Lightbulb, Zap, Clock, Star } from 'lucide-react';

const Services: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const services = [
    {
      icon: Brain,
      title: "AI & Machine Learning Development",
      description: "Custom AI solutions, LLM optimization, RLHF implementation, and intelligent automation systems.",
      features: [
        "Custom AI model development",
        "LLM training and optimization",
        "RLHF implementation",
        "Prompt engineering",
        "AI integration consulting"
      ],
      pricing: "Starting at $2000",
      duration: "2-8 weeks",
      category: "Technical"
    },
    {
      icon: Code,
      title: "Full-Stack Web Development",
      description: "Modern, responsive web applications using cutting-edge technologies and best practices.",
      features: [
        "React/TypeScript applications",
        "RESTful API development",
        "Database design and optimization",
        "Cloud deployment",
        "Performance optimization"
      ],
      pricing: "Starting at $1500",
      duration: "3-12 weeks",
      category: "Technical"
    },
    {
      icon: BarChart3,
      title: "Data Science & Analytics",
      description: "Transform your data into actionable insights with advanced analytics and visualization.",
      features: [
        "Data analysis and modeling",
        "Interactive dashboards",
        "Predictive analytics",
        "Statistical analysis",
        "Data visualization"
      ],
      pricing: "Starting at $1200",
      duration: "2-6 weeks",
      category: "Technical"
    },
    {
      icon: Users,
      title: "Community Management & Strategy",
      description: "Build and grow engaged communities with strategic planning and hands-on management.",
      features: [
        "Community strategy development",
        "Social media management",
        "Content creation and curation",
        "Event planning and execution",
        "Engagement analytics"
      ],
      pricing: "Starting at $800",
      duration: "Ongoing",
      category: "Strategic"
    },
    {
      icon: Lightbulb,
      title: "Technical Consultation & Training",
      description: "Expert guidance on technology decisions, architecture, and team training.",
      features: [
        "Technology stack selection",
        "Architecture design review",
        "Code review and optimization",
        "Team training and workshops",
        "Best practices implementation"
      ],
      pricing: "Starting at $150/hour",
      duration: "Flexible",
      category: "Consultation"
    },
    {
      icon: Zap,
      title: "Rapid Prototyping & MVP",
      description: "Quick turnaround for proof-of-concepts, prototypes, and minimum viable products.",
      features: [
        "Rapid prototype development",
        "MVP design and implementation",
        "User feedback integration",
        "Iterative development",
        "Market validation support"
      ],
      pricing: "Starting at $1000",
      duration: "1-4 weeks",
      category: "Technical"
    }
  ];

  const packages = [
    {
      name: "Startup Package",
      price: "$2,500",
      duration: "1 month",
      description: "Perfect for startups needing a complete digital presence",
      features: [
        "Full-stack web application",
        "Basic AI integration",
        "Database setup",
        "Cloud deployment",
        "2 weeks support"
      ],
      popular: false
    },
    {
      name: "Growth Package",
      price: "$5,000",
      duration: "2 months",
      description: "Comprehensive solution for growing businesses",
      features: [
        "Advanced web application",
        "Custom AI/ML models",
        "Data analytics dashboard",
        "Community management",
        "1 month support"
      ],
      popular: true
    },
    {
      name: "Enterprise Package",
      price: "$10,000+",
      duration: "3+ months",
      description: "Full-scale enterprise solutions with ongoing support",
      features: [
        "Enterprise-grade applications",
        "Advanced AI implementation",
        "Comprehensive data solutions",
        "Team training and workshops",
        "Ongoing support and maintenance"
      ],
      popular: false
    }
  ];

  return (
    <section id="services" className="section-padding bg-primary-dark">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Services</span> & Solutions
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive technical and strategic solutions for your business needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card group hover:border-accent/40"
            >
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg mr-4 group-hover:scale-110 transition-transform">
                  <service.icon size={24} className="text-primary" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${service.category === 'Technical' ? 'bg-accent/20 text-accent' : 
                    service.category === 'Strategic' ? 'bg-secondary/20 text-secondary' : 
                    'bg-tertiary/20 text-purple-300'}`}>
                  {service.category}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-400 text-sm flex items-start">
                      <span className="text-accent mr-2 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm border-t border-gray-700 pt-4">
                <div className="flex items-center text-secondary">
                  <Clock size={16} className="mr-1" />
                  {service.duration}
                </div>
                <div className="text-accent font-bold">
                  {service.pricing}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Packages */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">Service Packages</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className={`card relative ${pkg.popular ? 'border-accent shadow-lg transform scale-105' : 'border-gray-700'}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-secondary to-accent text-primary px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Star size={16} className="mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold mb-2 text-white">{pkg.name}</h4>
                  <div className="text-4xl font-bold gradient-text mb-2">{pkg.price}</div>
                  <p className="text-gray-400">{pkg.duration}</p>
                </div>

                <p className="text-gray-400 text-center mb-6">{pkg.description}</p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-300 flex items-start">
                      <span className="text-accent mr-2 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  pkg.popular 
                    ? 'bg-gradient-to-r from-secondary to-accent text-primary hover:shadow-lg' 
                    : 'border-2 border-accent text-accent hover:bg-accent hover:text-primary'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Me */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">Why Choose My Services</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Fast Delivery</h4>
              <p className="text-gray-400 text-sm">Quick turnaround without compromising quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Premium Quality</h4>
              <p className="text-gray-400 text-sm">Production-ready solutions with best practices</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-tertiary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Dedicated Support</h4>
              <p className="text-gray-400 text-sm">Ongoing support and maintenance included</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb size={32} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Innovation Focus</h4>
              <p className="text-gray-400 text-sm">Cutting-edge technologies and approaches</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;