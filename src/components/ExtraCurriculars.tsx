import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, Users, Trophy, BookOpen, Code, Calendar, ExternalLink, CheckCircle } from "lucide-react";

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
    <section id="extracurriculars" className="py-12 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            <span className="text-green-600">Extra-Curricular</span> Activities
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
            Activity Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                className={`px-4 py-2 rounded-full ${category.color} font-medium flex items-center`}
              >
                <category.icon size={16} className="mr-2" />
                {category.name} ({category.count})
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card hover:border-accent/40 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {activity.category === "Social Work" && <Heart className="text-accent mr-3" size={24} />}
                  {activity.category === "Events" && <Calendar className="text-accent mr-3" size={24} />}
                  {activity.category === "Drama" && <BookOpen className="text-accent mr-3" size={24} />}
                  {activity.category === "Leadership" && <Users className="text-accent mr-3" size={24} />}
                  {activity.verified && (
                    <CheckCircle className="text-green-400" size={20} />
                  )}
                </div>
                <span className="text-xs text-gray-400 px-2 py-1 bg-primary-dark rounded">
                  {activity.category}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
                {activity.title}
              </h3>

              <div className="flex items-center mb-3 text-gray-400 text-sm">
                <Calendar size={16} className="mr-2" />
                {activity.date}
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {activity.description}
              </p>

              <div className="mb-4">
                <p className="text-white font-semibold mb-2 text-sm">
                  Impact:
                </p>
                <p className="text-green-400 text-sm mb-3">
                  {activity.impact}
                </p>
                <p className="text-white font-semibold mb-2 text-sm">
                  Skills Developed:
                </p>
                <div className="flex flex-wrap gap-1">
                  {activity.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-primary-dark rounded text-xs text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <button className="flex items-center text-accent hover:text-secondary transition-colors text-sm">
                  <ExternalLink size={16} className="mr-2" />
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
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
            Life Beyond Work
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">9</div>
              <p className="text-gray-400">Activities Completed</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">4</div>
              <p className="text-gray-400">Categories Explored</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <p className="text-gray-400">Commitment Level</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1</div>
              <p className="text-gray-400">Year of Engagement</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExtraCurriculars;
