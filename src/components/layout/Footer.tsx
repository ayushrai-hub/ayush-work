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
  Link as LinkIcon,
  Calendar
} from 'lucide-react';
import { profiles } from '../../lib/profilesData';
import { useGTM } from '../../hooks/useGTM';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      heart: Heart,
      calendar: Calendar
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

  // Bottom section platform links
  const bottomPlatformLinks = [
    { name: 'Workana', url: 'https://www.workana.com/freelancer/052bc40cbb5e205f5b39bbf629409be3' },
    { name: 'Guru', url: 'https://www.guru.com/freelancers/ayushrai02' },
    { name: 'Codementor', url: 'https://www.codementor.io/@ayushrai188327' },
    { name: 'Lemon.io', url: 'https://magic.lemon.io/share/candidate?id=68c09bc7d31295bad67a375f&availability=Full-time%20only' },
    { name: 'ProductHunt', url: 'https://www.producthunt.com/@ayush_rai02' },
    { name: 'PeoplePerHour', url: 'https://www.peopleperhour.com/freelancer/ayush-rai-zymqwwmm' },
    { name: 'Freelancer', url: 'https://www.freelancer.com/u/ayushrai0211' },
    { name: 'Arc.dev', url: 'https://arc.dev/@ayushrai188327' },
    { name: 'Turing', url: 'https://matching.turing.com/developer-resume-preview/69045f6db69910c43569fa230383aefb09b9814f2621b6' },
    { name: 'Upwork', url: 'https://www.upwork.com/freelancers/~0154ec8cf0990e80bc?mp_source=share' },
    { name: 'Fiverr', url: 'https://www.fiverr.com/ayush_rai02?public_mode=true' }
  ];

  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-secondary-900/20 to-primary-dark pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Compact Footer Content */}
        <div className="py-4 md:py-6">
          {/* Main Content - Single Row Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <h3 className="text-base md:text-lg font-bold mb-1">Ayush Rai</h3>
              <p className="text-gray-400 text-xs mb-2">Polymath | AI Engineer | Creative Technologist</p>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs mb-1.5">Connect:</span>
                <div className="flex items-center space-x-1.5">
                  {primarySocials.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleExternalLink(social.url, social.name)}
                        className={`p-1.5 bg-gray-800/50 hover:bg-gray-800 rounded transition-all duration-300 ${social.color}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title={social.name}
                      >
                        <IconComponent size={14} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-1"
            >
              <h4 className="font-semibold mb-2 text-gray-300 text-xs">Quick Links</h4>
              <div className="flex flex-col space-y-1">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleSectionNavigation(link.href)}
                    className="text-gray-400 hover:text-white transition-colors text-xs text-left hover:bg-gray-800/30 px-1.5 py-0.5 rounded"
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
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-1"
            >
              <h4 className="font-semibold mb-2 text-gray-300 text-xs">Top Platforms</h4>
              <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto pr-1">
                {Object.entries(filteredGroupedProfiles).slice(0, 2).flatMap(([_domainName, domainProfiles]) => { // eslint-disable-line @typescript-eslint/no-unused-vars
                  return domainProfiles.map((profile) => {
                    const IconComponent = getIcon(profile.icon);
                    return (
                      <a
                        key={profile.id}
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleExternalLink(profile.url, profile.name)}
                        className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors group text-xs"
                      >
                        <IconComponent size={12} className="flex-shrink-0" />
                        <span className="group-hover:underline truncate">{profile.name}</span>
                      </a>
                    );
                  });
                })}
              </div>
            </motion.div>

            {/* More Platforms - Compact */}
            {Object.keys(filteredGroupedProfiles).length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="md:col-span-1"
              >
                <h4 className="font-semibold mb-2 text-gray-300 text-xs">More Platforms</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(filteredGroupedProfiles).slice(2).flatMap(([_domainName, domainProfiles]) => { // eslint-disable-line @typescript-eslint/no-unused-vars
                    return domainProfiles.map((profile) => {
                      const IconComponent = getIcon(profile.icon);
                      return (
                        <a
                          key={profile.id}
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleExternalLink(profile.url, profile.name)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors group text-xs"
                        >
                          <IconComponent size={12} className="flex-shrink-0" />
                          <span className="group-hover:underline truncate">{profile.name}</span>
                        </a>
                      );
                    });
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Bottom - Compact */}
        <div className="border-t border-gray-800 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3">
            <p className="text-gray-500 text-xs">
              &copy; 2025 Ayush Rai
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
              {bottomPlatformLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleExternalLink(platform.url, platform.name)}
                  className="text-gray-400 hover:text-accent transition-colors text-xs flex items-center space-x-0.5 group px-1.5 py-0.5 rounded hover:bg-gray-800/30"
                >
                  <span>{platform.name}</span>
                  <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform opacity-70" />
                </a>
              ))}
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
