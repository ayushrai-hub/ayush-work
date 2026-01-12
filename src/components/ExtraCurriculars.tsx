/**
 * ExtraCurriculars.tsx — Extracurricular activities and achievements showcase component.
 *
 * This component displays Ayush Rai's extracurricular activities spanning social welfare,
 * performing arts, events organization, and community service. Features categorized
 * activities with detailed descriptions, impact metrics, and skills developed through
 * each initiative. Provides a comprehensive view of personal development outside academics
 * and professional work, showcasing leadership and community engagement.
 *
 * The component includes:
 * - Activity categorization (Events, Social Work, Drama, Leadership)
 * - Impact assessment and measurable outcomes for each activity
 * - Skills development tracking and competency building
 * - Timeline and duration tracking for activities
 * - Verification status and credibility indicators
 * - Community engagement statistics and reach metrics
 *
 * Activity Categories:
 * - Events: Organization and management of community events
 * - Social Work: Community service and welfare initiatives
 * - Drama: Performing arts and cultural activities
 * - Leadership: Leadership roles and organizational contributions
 *
 * Impact Areas:
 * - Social welfare and community betterment
 * - Cultural enrichment and arts engagement
 * - Leadership skill development and organizational management
 * - Cross-functional collaboration and team building
 *
 * @component
 * @example
 * ```tsx
 * import ExtraCurriculars from './components/ExtraCurriculars';
 *
 * function App() {
 *   return <ExtraCurriculars />;
 * }
 * ```
 *
 * @see {@link src/components/CommunityLeadership.tsx} for community leadership initiatives
 * @see {@link src/components/AboutMe.tsx} for personal profile integration
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, Users, BookOpen, Calendar, ExternalLink, CheckCircle } from "lucide-react";

/**
 * ExtraCurriculars — Extracurricular activities showcase component.
 *
 * Displays comprehensive extracurricular achievements and activities across
 * multiple domains including social service, arts, events, and leadership.
 * Features categorization, impact metrics, and skills development tracking.
 *
 * @component
 * @returns {JSX.Element} The rendered ExtraCurriculars section
 *
 * @example
 * ```tsx
 * <ExtraCurriculars />
 * ```
 *
 * @see {@link src/components/About.tsx} for personal story context
 */
const ExtraCurriculars: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const activities = [
    {
      title: "Beyond The Words",
      category: "Events",
      date: "Apr. 2022 - May 2022",
      description: "Open mic event organized at Indian Institute of Technology, Madras",
      impact: "Successfully organized and managed open mic event",
      skills: ["Leadership", "Team Management", "Excel", "Communication", "Operations"],
      verified: true,
    },
    {
      title: "BachpanShala",
      category: "Social Work",
      date: "June 2022 - Jan. 2023",
      description: "Social welfare initiative with We Care organization as member-tutor",
      impact: "Contributed to educational support for underprivileged children",
      skills: ["Empathy", "Teaching", "Teamwork", "Operations", "Volunteering"],
      verified: true,
    },
    {
      title: "Model United Nations",
      category: "Events",
      date: "March 2022 - Sept. 2022",
      description: "Core member organizing Model United Nations Conference at LNCT Group of Colleges, Bhopal",
      impact: "Successfully organized international relations simulation event",
      skills: ["Leadership", "Team Management", "Sales", "Communication", "Operations"],
      verified: true,
    },
    {
      title: "Speak Up Tara - Drama Aayam",
      category: "Drama",
      date: "Nov. 2022 - Dec. 2022",
      description: "Performed as chorus member in drama production at Indian Institute of Technology, Madras",
      impact: "Contributed to theatrical performance and cultural event",
      skills: ["Performance", "Teamwork", "Communication", "Arts"],
      verified: true,
    },
    {
      title: "We Care",
      category: "Social Work",
      date: "June 2022 - Jan. 2023",
      description: "Volunteer work with We Care organization focusing on community welfare and social service initiatives",
      impact: "Contributed to community welfare and social betterment programs",
      skills: ["Community Outreach", "Social Services", "Volunteering", "Empathy", "Teamwork"],
      verified: true,
    },
    {
      title: "Management Team Member",
      category: "Leadership",
      date: "May 2022 - Nov 2022",
      description: "Contributed to organizational management and strategic initiatives at The Curious Organization",
      impact: "Supported organizational growth and development activities",
      skills: ["Team Management", "Project Coordination", "Strategic Planning", "Communication"],
      verified: true,
    },
    {
      title: "Volunteer & Member - Raahat",
      category: "Social Work",
      date: "Nov 2022 - July 2023",
      description: "Member of Raahat - Be The Change Maker club at LNCT Group, contributing to social impact initiatives",
      impact: "Supported organizational goals for community betterment",
      skills: ["Community Engagement", "Social Impact", "Team Collaboration", "Event Organization"],
      verified: true,
    },
    {
      title: "Volunteer - Dragonfly Festival",
      category: "Social Work",
      date: "July 2022 - May 2023",
      description: "Participated in WWF India's Dragonfly Festival for environmental conservation and awareness",
      impact: "Engaged in community outreach for environmental education",
      skills: ["Environmental Education", "Community Outreach", "Event Management", "Conservation Awareness"],
      verified: true,
    },
    {
      title: "Volunteer - Hack2Skill",
      category: "Events",
      date: "July 2022 - Aug 2022",
      description: "Supported coding and skill development initiatives through Hack2Skill volunteer activities",
      impact: "Helped promote coding education and skill building",
      skills: ["Programming Education", "Event Coordination", "Community Building", "Technical Support"],
      verified: true,
    },
  ];

  const categories = [
    { name: "Events", count: 3, color: "bg-orange-500/20 text-orange-400", icon: Calendar },
    { name: "Social Work", count: 4, color: "bg-red-500/20 text-red-400", icon: Heart },
    { name: "Drama", count: 1, color: "bg-purple-500/20 text-purple-400", icon: BookOpen },
    { name: "Leadership", count: 1, color: "bg-blue-500/20 text-blue-400", icon: Users },
  ];

  return (
    <section id="extracurriculars" className="py-8 md:py-10 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            <span className="text-green-600">Extra-Curricular</span> Activities
          </h2>
          <div className="w-20 h-0.5 bg-green-600 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Beyond academics and work - passions, causes, and experiences that shape my journey
          </p>
        </motion.div>

        {/* Category Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 gradient-text">
            Activity Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                className={`px-2.5 py-1 rounded-full ${category.color} font-medium flex items-center text-xs`}
              >
                <category.icon size={14} className="mr-1.5" />
                {category.name} ({category.count})
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card hover:border-accent/40 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {activity.category === "Social Work" && <Heart className="text-secondary dark:text-accent mr-2" size={18} />}
                  {activity.category === "Events" && <Calendar className="text-secondary dark:text-accent mr-2" size={18} />}
                  {activity.category === "Drama" && <BookOpen className="text-secondary dark:text-accent mr-2" size={18} />}
                  {activity.category === "Leadership" && <Users className="text-secondary dark:text-accent mr-2" size={18} />}
                  {activity.verified && (
                    <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-primary-dark rounded">
                  {activity.category}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold mb-1.5 text-gray-800 dark:text-white group-hover:text-secondary dark:group-hover:text-accent transition-colors">
                {activity.title}
              </h3>

              <div className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-xs">
                <Calendar size={12} className="mr-1.5" />
                {activity.date}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 leading-relaxed">
                {activity.description}
              </p>

              <div className="mb-3">
                <p className="text-gray-800 dark:text-white font-semibold mb-1.5 text-xs">
                  Impact:
                </p>
                <p className="text-green-600 dark:text-green-400 text-xs mb-2 leading-tight">
                  {activity.impact}
                </p>
                <p className="text-gray-800 dark:text-white font-semibold mb-1.5 text-xs">
                  Skills:
                </p>
                <div className="flex flex-wrap gap-1">
                  {activity.skills.slice(0, 4).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-1.5 py-0.5 bg-gray-100 dark:bg-primary-dark rounded-md text-xs text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <button className="flex items-center text-secondary dark:text-accent hover:text-secondary-600 dark:hover:text-secondary transition-colors text-xs">
                  <ExternalLink size={14} className="mr-1.5" />
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 gradient-text">
            Life Beyond Work
          </h3>
          <div className="grid md:grid-cols-4 gap-3 md:gap-4">
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">9</div>
              <p className="text-gray-400 text-xs">Activities</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">4</div>
              <p className="text-gray-400 text-xs">Categories</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">100%</div>
              <p className="text-gray-400 text-xs">Commitment</p>
            </div>
            <div className="card text-center py-3">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">1</div>
              <p className="text-gray-400 text-xs">Year</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExtraCurriculars;
