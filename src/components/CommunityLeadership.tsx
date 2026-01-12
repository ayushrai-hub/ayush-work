/**
 * CommunityLeadership.tsx — Community leadership activities and mentorship showcase component.
 *
 * This component showcases Ayush Rai's leadership activities across education, community development,
 * and mentorship initiatives. Features interactive filtering by leadership categories, detailed
 * achievement tracking, and impact metrics for community engagement. Includes workshops conducted,
 * mentorship programs, and community building initiatives with measurable outcomes.
 *
 * The component includes:
 * - Leadership activity cards with detailed achievements
 * - Category-based filtering (education, government, diversity)
 * - Impact metrics and measurable outcomes
 * - Workshop and event showcase
 * - Community engagement statistics
 * - Interactive filtering and search capabilities
 *
 * Leadership Categories:
 * - Education: Workshops, mentoring, technical training
 * - Government: Community outreach and technology programs
 * - Diversity: Women in tech, social welfare initiatives
 *
 * Key Impact Areas:
 * - Education and skill development (1000+ students impacted)
 * - Community welfare and social service
 * - Technical mentorship and career guidance
 * - Cross-cultural collaboration (Taiwan-India initiatives)
 *
 * @component
 * @example
 * ```tsx
 * import CommunityLeadership from './components/CommunityLeadership';
 *
 * function App() {
 *   return <CommunityLeadership />;
 * }
 * ```
 *
 * @see {@link src/components/Profiles.tsx} for social media integration
 * @see {@link src/components/Experience.tsx} for professional leadership roles
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Mic, BookOpen, Heart, Target, Zap, MapPin } from "lucide-react";

/**
 * CommunityLeadership — Community leadership showcase component.
 *
 * Displays comprehensive leadership portfolio including education initiatives,
 * community engagement, mentorship programs, and impact metrics. Features
 * category filtering and detailed achievement documentation.
 *
 * @component
 * @returns {JSX.Element} The rendered CommunityLeadership section
 *
 * @example
 * ```tsx
 * <CommunityLeadership />
 * ```
 *
 * @see {@link src/components/AboutMe.tsx} for personal leadership mention
 * @see {@link src/components/ExtraCurriculars.tsx} for additional leadership activities
 */
const CommunityLeadership: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState("all");

  const leadershipActivities = [
    {
      id: 1,
      title: "Tech Innovation Hub Coordinator",
      organization: "University Technology Center",
      category: "education",
      duration: "Jan 2023 - Dec 2023",
      role: "Innovation Coordinator & Student Mentor",
      achievements: [
        "Established university-wide innovation programs",
        "Mentored 100+ students in emerging technologies",
        "Organized 20+ tech workshops and hackathons",
        "Secured $30K+ funding for student projects",
      ],
      impact: "Fostered innovation culture among 500+ students",
      color: "from-blue-600 to-blue-400",
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
        "Achieved 95% participant satisfaction rate",
      ],
      impact: "Empowered 1000+ students with modern development skills",
      color: "from-yellow-600 to-orange-400",
    },
    {
      id: 3,
      title: "Digital Skills Training Coordinator",
      organization: "Community Education Foundation",
      category: "education",
      duration: "Mar 2023 - Present",
      role: "Training Coordinator & Community Educator",
      achievements: [
        "Developed comprehensive digital literacy programs",
        "Trained 200+ individuals in essential digital skills",
        "Created accessible online learning resources",
        "Partnered with 15+ local organizations",
      ],
      impact: "Bridged digital divide for underserved communities",
      color: "from-pink-600 to-rose-400",
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
        "Reached 50K+ students through online content",
      ],
      impact: "Accelerated Microsoft's developer ecosystem growth",
      color: "from-blue-600 to-blue-400",
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
        "Created comprehensive open source curriculum",
      ],
      impact: "Cultivated sustainable open source culture in universities",
      color: "from-purple-600 to-indigo-400",
    },
    {
      id: 6,
      title: "Community Tech Outreach Program",
      organization: "Local Government Technology Department",
      category: "government",
      duration: "Jun 2023 - Present",
      role: "Technology Outreach Coordinator",
      achievements: [
        "Developed community technology education programs",
        "Partnered with local schools for digital literacy",
        "Implemented technology access initiatives",
        "Created sustainable community tech support systems",
      ],
      impact: "Enhanced digital inclusion across local communities",
      color: "from-cyan-600 to-blue-400",
    },
  ];

  const workshopsEvents = [
    {
      title: "AI/ML Bootcamp for Beginners",
      date: "Feb 2024",
      participants: 150,
      location: "LNCT University, Bhopal",
      description:
        "Comprehensive 3-day AI/ML bootcamp covering machine learning fundamentals and real-world applications.",
    },
    {
      title: "Women in Tech Career Workshop",
      date: "Jan 2024",
      participants: 80,
      location: "IIT Madras & Virtual",
      description:
        "Empowering women in technology with career guidance, networking, and skill development sessions.",
    },
    {
      title: "Cross-border Tech Innovation Summit",
      date: "Dec 2023",
      participants: 300,
      location: "Taiwan - India Virtual Summit",
      description:
        "Brought together 150+ innovators from Taiwan and India for cross-cultural technology collaboration.",
    },
    {
      title: "Open Source Contribution Drive",
      date: "Nov 2023",
      participants: 200,
      location: "Multiple Universities, India",
      description:
        "Guided students through their first open source contributions across 15+ GitHub repositories.",
    },
    {
      title: "AI Ethics & Responsible AI Workshop",
      date: "Oct 2023",
      participants: 120,
      location: "Various Tech Institutes",
      description:
        "Advanced workshop on ethical AI considerations, bias detection, and responsible AI deployment.",
    },
  ];

  const categories = [
    { id: "all", label: "All", icon: Users },
    { id: "government", label: "Government", icon: MapPin },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "diversity", label: "Diversity", icon: Heart },
  ];

  const filteredActivities =
    activeCategory === "all"
      ? leadershipActivities
      : leadershipActivities.filter(
          (activity) => activity.category === activeCategory
        );

  return (
    <section id="community" className="py-8 md:py-10 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            <span className="text-blue-600">Community Leadership</span>
          </h2>
          <div className="w-20 h-0.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Building bridges between technology, education, and community impact
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                activeCategory === category.id
                  ? "bg-secondary dark:bg-accent text-primary shadow-md"
                  : "bg-gray-100 dark:bg-primary-dark border border-gray-200 dark:border-accent/20 text-secondary dark:text-accent hover:border-secondary dark:hover:border-accent hover:bg-secondary/10 dark:hover:bg-accent/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon size={14} className="mr-1.5" />
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Leadership Activities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r ${activity.color} rounded-md mr-3`}
                  >
                    <Users size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="text-secondary dark:text-accent font-semibold text-sm">
                      {activity.organization}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activity.category === "government"
                      ? "bg-blue-500/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : activity.category === "education"
                      ? "bg-blue-500/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : activity.category === "diversity"
                      ? "bg-pink-500/20 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400"
                      : "bg-purple-500/20 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                  }`}
                >
                  {activity.category}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1.5">
                  {activity.duration}
                </p>
                <p className="text-gray-800 dark:text-white font-semibold mb-2 text-sm">{activity.role}</p>

                <div className="space-y-1.5 mb-3">
                  {activity.achievements.slice(0, 3).map((achievement, achIndex) => (
                    <div key={achIndex} className="flex items-start">
                      <Zap
                        className="text-secondary dark:text-secondary mt-0.5 mr-1.5 flex-shrink-0"
                        size={12}
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-xs leading-tight">
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex items-center">
                    <Target className="text-secondary dark:text-accent mr-1.5" size={14} />
                    <span className="text-secondary dark:text-accent font-semibold text-xs">
                      {activity.impact}
                    </span>
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
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 gradient-text">
            Recent Workshops & Events
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshopsEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-2">
                  <Mic className="text-secondary mr-2" size={16} />
                  <span className="text-secondary dark:text-accent font-semibold text-xs">
                    {event.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-gray-800 dark:text-white mb-2">
                  {event.title}
                </h4>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <Users size={12} className="mr-1.5" />
                    <span>{event.participants} participants</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <MapPin size={12} className="mr-1.5" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityLeadership;
