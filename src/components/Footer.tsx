import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  ArrowUp,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Code,
  Palette,
  BarChart3,
  FileText,
  Briefcase,
  Heart,
  Database,
  Bot,
  Droplets,
  Edit,
  Trophy,
  Link as LinkIcon
} from 'lucide-react';
import { profiles, domains } from '../lib/profilesData';
import { useGTM } from '../hooks/useGTM';

const Footer: React.FC = () => {
  const { trackButton, trackExternal } = useGTM();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    trackButton('back_to_top', 'footer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExternalLink = (url: string, name: string) => {
    trackExternal(url, name);
  };

  // Handle navigation to sections
  const handleSectionNavigation = (href: string) => {
    if (href === '/') {
      navigate('/');
    } else if (location.pathname !== '/') {
      // If not on main page, navigate to main page first
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const sectionId = href.split('#')[1];
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on main page, just scroll
      const sectionId = href.split('#')[1];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  /**
   * Gets the appropriate icon component based on the icon name
   * @param iconName - The name of the icon to retrieve
   * @returns The React component for the specified icon, or Globe as fallback
   */
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      code: Code,
      award: Trophy,
      'bar-chart-2': BarChart3,
      database: Database,
      robot: Bot,
      image: Palette,
      palette: Palette,
      droplet: Droplets,
      'book-open': FileText,
      'edit-3': Edit,
      cloud: Briefcase,
      briefcase: Briefcase,
      'layout-grid': Globe,
      globe: Globe,
      link: LinkIcon,
      heart: Heart
    };
    return icons[iconName.toLowerCase().replace('-', '')] || Globe;
  };

  // Group profiles by domain
  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.domain]) {
      acc[profile.domain] = [];
    }
    acc[profile.domain].push(profile);
    return acc;
  }, {} as { [key: string]: typeof profiles });

  // Primary social links
  const primarySocials = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/ayushrai02',
      icon: Linkedin,
      color: 'hover:text-blue-500'
    },
    {
      name: 'Twitter',
      url: 'https://x.com/AyushRai0211',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/ayush_rai02/',
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/ayushrai-hub',
      icon: Github,
      color: 'hover:text-gray-300'
    },
    {
      name: 'Email',
      url: 'mailto:ayushrai0211@gmail.com',
      icon: Mail,
      color: 'hover:text-red-400'
    }
  ];

  // Get IDs of primary social links to exclude from main sections
  const primarySocialIds = primarySocials.map(social =>
    social.name.toLowerCase().split('/')[0].replace(' ', '-').replace('.', '').replace('@', '')
  );

  // Bottom section platforms that are already in footer bottom - exclude from More Platforms
  const bottomSectionIds = ['workana', 'guru', 'codementor', 'lemonio', 'producthunt', 'upwork', 'fiverr', 'peopleperhour', 'freelancer', 'arc.dev', 'turing'];

  // Filter out primary social profiles and bottom section profiles from grouped profiles
  const filteredGroupedProfiles = Object.fromEntries(
    Object.entries(groupedProfiles).map(([domainName, domainProfiles]) => {
      return [
        domainName,
        domainProfiles.filter(profile => !primarySocialIds.includes(profile.id) && !bottomSectionIds.includes(profile.id))
      ];
    })
  );

  // Quick navigation links
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Me', href: '/#aboutme' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' }
  ];

  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-secondary-900/20 to-primary-dark pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Compact Footer Content */}
        <div className="py-8">
          {/* Top Section - Brand & Social */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 md:mb-0"
            >
              <h3 className="text-xl font-bold mb-1">Ayush Rai</h3>
              <p className="text-gray-400 text-sm">Polymath | AI Engineer | Creative Technologist</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <span className="text-gray-400 text-sm hidden md:block">Connect:</span>
              {primarySocials.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLink(social.url, social.name)}
                    className={`p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all duration-300 ${social.color} hover:scale-110`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <IconComponent size={18} />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Middle Section - Quick Links & Platforms */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Quick Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-semibold mb-3 text-gray-300 text-sm">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.slice(0, 4).map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleSectionNavigation(link.href)}
                    className="text-gray-400 hover:text-white transition-colors text-xs text-left hover:bg-gray-800/30 px-2 py-1 rounded"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Top Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold mb-3 text-gray-300 text-sm">Top Platforms</h4>
              <div className="space-y-2">
                {Object.entries(filteredGroupedProfiles).slice(0, 2).flatMap(([domainName, domainProfiles]) => {
                  return domainProfiles.map((profile) => {
                    const IconComponent = getIcon(profile.icon);
                    return (
                      <a
                        key={profile.id}
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleExternalLink(profile.url, profile.name)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group text-xs"
                      >
                        <IconComponent size={14} className="flex-shrink-0" />
                        <span className="group-hover:underline truncate">{profile.name}</span>
                      </a>
                    );
                  });
                })}
              </div>
            </motion.div>

            {/* More Platforms - Compact Cards */}
            {Object.keys(groupedProfiles).length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="font-semibold mb-3 text-gray-300 text-sm">More Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filteredGroupedProfiles).slice(2).flatMap(([domainName, domainProfiles]) => {
                    const domain = domains.find(d => d.name === domainName);
                    if (!domain) return [];

                    return domainProfiles.map((profile) => {
                      const IconComponent = getIcon(profile.icon);
                      return (
                        <motion.a
                          key={profile.id}
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleExternalLink(profile.url, profile.name)}
                          className="flex flex-col items-center p-2 bg-gray-800/30 hover:bg-gray-800/60 rounded-lg transition-all duration-300 hover:scale-105 group min-w-[60px]"
                          whileHover={{ y: -1 }}
                        >
                          <IconComponent size={16} className="text-gray-400 group-hover:text-accent mb-1 transition-colors" />
                          <span className="text-xs text-gray-400 group-hover:text-white text-center leading-tight truncate w-full">
                            {profile.name}
                          </span>
                        </motion.a>
                      );
                    });
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-500 text-xs">
              &copy; 2025 Ayush Rai
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.workana.com/freelancer/052bc40cbb5e205f5b39bbf629409be3"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.workana.com/freelancer/052bc40cbb5e205f5b39bbf629409be3', 'Workana')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Workana</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.guru.com/freelancers/ayushrai02"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.guru.com/freelancers/ayushrai02', 'Guru')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Guru</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.codementor.io/@ayushrai188327"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.codementor.io/@ayushrai188327', 'Codementor')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Codementor</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://magic.lemon.io/share/candidate?id=68c09bc7d31295bad67a375f&availability=Full-time%20only"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://magic.lemon.io/share/candidate?id=68c09bc7d31295bad67a375f&availability=Full-time%20only', 'Lemon.io')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Lemon.io</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.producthunt.com/@ayush_rai02"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.producthunt.com/@ayush_rai02', 'ProductHunt')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>ProductHunt</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.peopleperhour.com/freelancer/ayush-rai-zymqwwmm"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.peopleperhour.com/freelancer/ayush-rai-zymqwwmm', 'PeoplePerHour')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>PeoplePerHour</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.freelancer.com/u/ayushrai0211"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.freelancer.com/u/ayushrai0211', 'Freelancer.com')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Freelancer</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://arc.dev/@ayushrai188327"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://arc.dev/@ayushrai188327', 'Arc.dev')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Arc.dev</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://matching.turing.com/developer-resume-preview/69045f6db69910c43569fa230383aefb09b9814f2621b6"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://matching.turing.com/developer-resume-preview/69045f6db69910c43569fa230383aefb09b9814f2621b6', 'Turing Talent Network')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Turing Profile</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~0154ec8cf0990e80bc?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.upwork.com/freelancers/~0154ec8cf0990e80bc?mp_source=share', 'Upwork')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Upwork</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.fiverr.com/ayush_rai02?public_mode=true"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalLink('https://www.fiverr.com/ayush_rai02?public_mode=true', 'Fiverr')}
                className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-1 group"
              >
                <span>Fiverr</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 text-sm"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
