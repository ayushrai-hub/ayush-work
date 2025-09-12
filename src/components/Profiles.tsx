import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ExternalLink,
  Search,
  Filter,
  Users,
  Code,
  Palette,
  BarChart3,
  FileText,
  Briefcase,
  Globe,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { profiles, domains, Profile, Domain } from '../lib/profilesData';

const Profiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(domains.map(d => d.name)));
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Icon mapping
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      github: Code,
      code: Code, // LeetCode
      award: Code, // Unstop
      'bar-chart-2': BarChart3, // Kaggle
      database: BarChart3, // Data Science Portfolio
      robot: BarChart3, // Hugging Face
      image: Palette, // Behance
      droplet: Palette, // Dribbble
      'book-open': FileText, // Medium
      'edit-3': FileText, // Blogger
      linkedin: Briefcase,
      cloud: Briefcase, // Salesforce
      briefcase: Briefcase, // Upwork
      'layout-grid': Globe, // Notion Portfolio
      globe: Globe, // Super Site
      link: Globe, // Linktree
      twitter: Heart,
      instagram: Globe, // Use Globe as distinct icon
      facebook: Heart,
      'help-circle': Globe // Add icon mapping for Quora
    };
    return icons[iconName.toLowerCase().replace('-', '')] || Globe;
  };

  // Filter profiles based on search and domain
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'all' || profile.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchTerm, selectedDomain]);

  // Group profiles by domain
  const groupedProfiles = useMemo(() => {
    const groups: { [key: string]: Profile[] } = {};
    filteredProfiles.forEach(profile => {
      if (!groups[profile.domain]) {
        groups[profile.domain] = [];
      }
      groups[profile.domain].push(profile);
    });
    return groups;
  }, [filteredProfiles]);

  // Toggle domain expansion
  const toggleDomain = (domainName: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainName)) {
      newExpanded.delete(domainName);
    } else {
      newExpanded.add(domainName);
    }
    setExpandedDomains(newExpanded);
  };

  // Get domain info
  const getDomain = (domainName: string): Domain | undefined => {
    return domains.find(d => d.name === domainName);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const domainVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <section id="profiles" className="py-8 sm:py-12 bg-primary">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-secondary/10 to-accent/10 rounded-lg blur-3xl opacity-50 pointer-events-none"></div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 relative z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Profiles & <span className="gradient-text">Platforms</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto mb-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore My Profiles Across Platforms — From coding to design, writing, and social presence, here's everywhere you can connect with my work.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{profiles.length}+</div>
              <p className="text-gray-400 text-xs">Platforms</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{domains.length}</div>
              <p className="text-gray-400 text-xs">Categories</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search profiles, categories, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-primary-dark border border-accent/20 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none transition-colors text-sm"
                aria-label="Search profiles"
              />
            </div>

            {/* Domain Filters */}
            <div className="flex flex-wrap justify-center gap-2 pb-2">
              <button
                onClick={() => setSelectedDomain('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedDomain === 'all'
                    ? 'bg-accent text-primary shadow-lg scale-105'
                    : 'bg-primary-dark text-gray-300 hover:bg-accent/20 hover:text-accent border border-accent/20'
                }`}
                aria-pressed={selectedDomain === 'all'}
              >
                <Filter size={16} />
                <span>All Domains</span>
              </button>
              {domains.map((domain) => (
                <button
                  key={domain.name}
                  onClick={() => setSelectedDomain(domain.name)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedDomain === domain.name
                      ? `bg-gradient-to-r ${domain.gradient} text-primary shadow-lg scale-105`
                      : 'bg-primary-dark text-gray-300 hover:bg-accent/20 hover:text-accent border border-accent/20'
                  }`}
                  aria-pressed={selectedDomain === domain.name}
                >
                  <Sparkles size={16} />
                  <span className="capitalize">{domain.name.replace('-', ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Profile Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-8"
        >
          {Object.entries(groupedProfiles).map(([domainName, domainProfiles]) => {
            const domain = getDomain(domainName);
            if (!domain) return null;

            const isExpanded = expandedDomains.has(domainName);

            return (
              <motion.div
                key={domainName}
                variants={itemVariants}
                className="bg-primary-dark rounded-xl border border-accent/10 overflow-hidden"
              >
                {/* Domain Header */}
                <div
                  className={`bg-gradient-to-r ${domain.gradient} p-6 cursor-pointer`}
                  onClick={() => toggleDomain(domainName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleDomain(domainName)}
                  aria-expanded={isExpanded}
                  aria-controls={`domain-${domainName}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-primary capitalize mb-2">
                        {domainName.replace('-', ' ')}
                      </h3>
                      <p className="text-primary/80 text-sm">{domain.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary font-semibold bg-primary/20 px-3 py-1 rounded-full text-sm">
                        {domainProfiles.length} profile{domainProfiles.length !== 1 ? 's' : ''}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="text-primary" size={24} />
                      ) : (
                        <ChevronDown className="text-primary" size={24} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Cards */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`domain-${domainName}`}
                      variants={domainVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="p-6"
                    >
                      <motion.div
                        variants={containerVariants}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {domainProfiles.map((profile, index) => {
                          const IconComponent = getIcon(profile.icon);
                          return (
                            <motion.div
                              key={profile.id}
                              variants={itemVariants}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="group"
                            >
                              <div className="card p-4 h-full hover:shadow-xl transition-all duration-300 border border-accent/10 hover:border-accent/30">
                                <div className="flex items-center mb-3">
                                  <div className={`p-2 rounded-md bg-gradient-to-r ${domain.gradient} mr-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent className="text-primary" size={18} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-bold text-white mb-1">{profile.name}</h4>
                                    <span className="text-xs text-accent font-semibold px-2 py-1 bg-accent/10 rounded-full">
                                      {profile.category}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                  {profile.description}
                                </p>

                                <a
                                  href={profile.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center px-3 py-2 bg-gradient-to-r ${domain.gradient} text-primary font-semibold rounded-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 text-sm`}
                                  aria-label={`Visit ${profile.name} profile`}
                                >
                                  <ExternalLink size={14} className="mr-2" />
                                  Visit Profile
                                </a>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {Object.keys(groupedProfiles).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No profiles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Profiles;
