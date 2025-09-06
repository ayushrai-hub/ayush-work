import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Mic, Trophy, BookOpen, GitBranch, Heart, Target, Zap, Award, Calendar, MapPin } from 'lucide-react';

const CommunityLeadership: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState('all');

  const leadershipActivities = [
    {
      id: 1,
      title: "TMF Taiwan Ministry of Foreign Affairs",
      organization: "Ministry of Foreign Affairs, Taiwan",
      category: "government",
      duration: "Jan 2023 - Dec 2023",
      role: "Technology Ambassador & Cultural Exchange Lead",
      achievements: [
        "Led 15+ cross-cultural technology exchange programs",
        "Mentored 50+ international students in AI/ML",
        "Organized Taiwan-India joint hackathons",
        "Facilitated $50K+ in collaboration funding"
      ],
      impact: "Strengthened Taiwan-India technological partnerships",
      color: "from-blue-600 to-blue-400"
    },
    {
      id: 2,
      title: "Google Developer Student Club Lead",
      organization: "Google Developer Student Clubs",
      category: "education",
      duration: "Aug 2022 - Present",
      role: "Chapter Lead & Technical Mentor",
      achievements: [
        "Built community of 200+ developers",
        "Conducted 50+ workshops on modern technologies",
        "Organized Google Cloud Study Jams",
        "Achieved 95% participant satisfaction rate"
      ],
      impact: "Empowered 1000+ students with modern development skills",
      color: "from-yellow-600 to-orange-400"
    },
    {
      id: 3,
      title: "Women Techmakers Regional Lead",
      organization: "Google Women Techmakers",
      category: "diversity",
      duration: "Mar 2023 - Present",
      role: "Regional Lead & Program Coordinator",
      achievements: [
        "Increased regional participation by 300%",
        "Mentored 30+ women in tech roles",
        "Organized 12+ women-focused tech events",
        "Secured $25K funding for diversity initiatives"
      ],
      impact: "Advanced gender diversity in Indian tech community",
      color: "from-pink-600 to-rose-400"
    },
    {
      id: 4,
      title: "Microsoft Learn Student Ambassador",
      organization: "Microsoft for Students",
      category: "education",
      duration: "Jan 2024 - Present",
      role: "Regional Ambassador & Content Creator",
      achievements: [
        "Created 20+ technical content pieces",
        "Trained 100+ students on Azure and AI",
        "Organized Azure Hackathons",
        "Reached 50K+ students through online content"
      ],
      impact: "Accelerated Microsoft's developer ecosystem growth",
      color: "from-green-600 to-teal-400"
    },
    {
      id: 5,
      title: "Open Source Workshop Series",
      organization: "LNCT & S Bandhavgarh University",
      category: "education",
      duration: "Sept 2022 - Dec 2024",
      role: "Workshop Conductor & Mentor",
      achievements: [
        "Conducted 25+ open source workshops",
        "Mentored 500+ contributors to open source",
        "Built university open source communities",
        "Created comprehensive open source curriculum"
      ],
      impact: "Cultivated sustainable open source culture in universities",
      color: "from-purple-600 to-indigo-400"
    },
    {
      id: 6,
      title: "Smart City Bhopal Youth Council",
      organization: "Bhopal Smart City Initiative",
      category: "government",
      duration: "Jun 2023 - Present",
      role: "Youth Technology Advisor",
      achievements: [
        "Contributed to smart city AI implementations",
        "Advised on technology policy for youth",
        "Organized youth tech innovation challenges",
        "Influenced $100K+ in youth technology funding"
      ],
      impact: "Shaped future of technology in Bhopal Smart City",
      color: "from-cyan-600 to-blue-400"
    }
  ];

  const workshopsEvents = [
    {
      title: "AI/ML Bootcamp for Beginners",
      date: "Feb 2024",
      participants: 150,
      location: "LNCT University, Bhopal",
      description: "Comprehensive 3-day AI/ML bootcamp covering machine learning fundamentals and real-world applications."
    },
    {
      title: "Women in Tech Career Workshop",
      date: "Jan 2024",
      participants: 80,
      location: "IIT Madras & Virtual",
      description: "Empowering women in technology with career guidance, networking, and skill development sessions."
    },
    {
      title: "Cross-border Tech Innovation Summit",
      date: "Dec 2023",
      participants: 300,
      location: "Taiwan - India Virtual Summit",
      description: "Brought together 150+ innovators from Taiwan and India for cross-cultural technology collaboration."
    },
    {
      title: "Open Source Contribution Drive",
      date: "Nov 2023",
      participants: 200,
      location: "Multiple Universities, India",
      description: "Guided students through their first open source contributions across 15+ GitHub repositories."
    },
    {
      title: "AI Ethics & Responsible AI Workshop",
      date: "Oct 2023",
      participants: 120,
      location: "Various Tech Institutes",
      description: "Advanced workshop on ethical AI considerations, bias detection, and responsible AI deployment."
    }
  ];

  const impactMetrics = [
    {
      icon: Users,
      value: "1500+",
      label: "People Impacted",
      description: "Students, professionals, and community members reached through various initiatives"
    },
    {
      icon: BookOpen,
      value: "100+",
      label: "Workshops Conducted",
      description: "Educational sessions covering AI, open source, and professional development"
    },
    {
      icon: Trophy,
      value: "25+",
      label: "Awards & Recognitions",
      description: "Received for community leadership and educational contributions"
    },
    {
      icon: GitBranch,
      value: "50+",
      label: "Projects Mentored",
      description: "Individual and team projects guided towards successful completion"
    },
    {
      icon: Heart,
      value: "10+",
      label: "Communities Built",
      description: "Active technology and innovation communities established"
    },
    {
      icon: Target,
      value: "500K+",
      label: "Social Reach",
      description: "Combined reach through social media, events, and online content"
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'government', label: 'Government', icon: MapPin },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'diversity', label: 'Diversity', icon: Heart },
  ];

  const filteredActivities = activeCategory === 'all'
    ? leadershipActivities
    : leadershipActivities.filter(activity => activity.category === activeCategory);

  return (
    <section id="community" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Community Leadership</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Building bridges between technology, education, and community impact
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
        >
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
              className="card text-center"
            >
              <metric.icon className="mx-auto mb-3 text-accent" size={32} />
              <div className="text-2xl font-bold gradient-text mb-1">{metric.value}</div>
              <p className="text-white font-semibold text-sm mb-2">{metric.label}</p>
              <p className="text-gray-400 text-xs">{metric.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-accent text-primary shadow-lg'
                  : 'bg-primary-dark border border-accent/20 text-accent hover:border-accent hover:bg-accent/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon size={18} className="mr-2" />
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Leadership Activities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${activity.color} rounded-lg mr-4`}>
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                    <p className="text-accent font-semibold">{activity.organization}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activity.category === 'government' ? 'bg-blue-500/20 text-blue-400' :
                  activity.category === 'education' ? 'bg-green-500/20 text-green-400' :
                  activity.category === 'diversity' ? 'bg-pink-500/20 text-pink-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {activity.category}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">{activity.duration}</p>
                <p className="text-white font-semibold mb-3">{activity.role}</p>

                <div className="space-y-2 mb-4">
                  {activity.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex items-start">
                      <Zap className="text-secondary mt-0.5 mr-2 flex-shrink-0" size={14} />
                      <span className="text-gray-300 text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center">
                    <Target className="text-accent mr-2" size={16} />
                    <span className="text-accent font-semibold text-sm">{activity.impact}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Workshops & Events */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Recent Workshops & Events</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopsEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-3">
                  <Mic className="text-secondary mr-3" size={20} />
                  <span className="text-accent font-semibold">{event.date}</span>
                </div>

                <h4 className="text-lg font-bold text-white mb-3">{event.title}</h4>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Users size={14} className="mr-2" />
                    <span>{event.participants} participants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin size={14} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Impact Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center"
        >
          <div className="bg-glass rounded-2xl p-8 border border-accent/20">
            <Award className="mx-auto mb-4 text-accent" size={48} />
            <h3 className="text-3xl font-bold mb-4 gradient-text">Community Impact</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Passionate about fostering inclusive tech communities and empowering the next generation
              of innovators through education, mentorship, and collaborative initiatives.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">2022-2024</div>
                <p className="text-gray-400">Leadership Journey</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">6</div>
                <p className="text-gray-400">Major Roles</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">∞</div>
                <p className="text-gray-400">Future Impact</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityLeadership;
