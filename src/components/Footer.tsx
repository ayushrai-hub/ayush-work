import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin,
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
  Heart
} from 'lucide-react';
import { profiles, domains } from '../lib/profilesData';
import { useGTM } from '../hooks/useGTM';

const Footer: React.FC = () => {
  const { trackButton, trackExternal } = useGTM();

  const scrollToTop = () => {
    trackButton('back_to_top', 'footer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExternalLink = (url: string, name: string) => {
    trackExternal(url, name);
  };

  // Icon mapping for profiles
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      code: Code,
      award: Code,
      'bar-chart-2': BarChart3,
      database: BarChart3,
      robot: BarChart3,
      image: Palette,
      droplet: Palette,
      'book-open': FileText,
      'edit-3': FileText,
      cloud: Briefcase,
      briefcase: Briefcase,
      'layout-grid': Globe,
      globe: Globe,
      link: Globe,
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
      name: 'GitHub',
      url: 'https://github.com/ayushrai-hub',
      icon: Github,
      color: 'hover:text-gray-400'
    },
    {
      name: 'Email',
      url: 'mailto:ayushrai0211@gmail.com',
      icon: Mail,
      color: 'hover:text-red-500'
    }
  ];

  // Quick navigation links
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          {/* Primary Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">
              Let's <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Connect</span>
            </h2>
            <div className="flex justify-center space-x-8 mb-8">
              {primarySocials.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLink(social.url, social.name)}
                    className={`p-4 bg-gray-800 rounded-full transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <IconComponent size={24} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections Grid */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
            {/* Branding & Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <h3 className="text-2xl font-bold mb-4">Ayush Rai</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Polymath | AI Engineer | Creative Technologist
              </p>
              
              <h4 className="font-semibold mb-3 text-gray-300">Quick Links</h4>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Profiles & Platforms */}
            {Object.entries(groupedProfiles).slice(0, 3).map(([domainName, domainProfiles], index) => {
              const domain = domains.find(d => d.name === domainName);
              if (!domain) return null;

              return (
                <motion.div
                  key={domainName}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <h4 className="font-semibold mb-4 text-gray-300 capitalize">
                    {domainName.replace('-', ' ')}
                  </h4>
                  <div className="space-y-3">
                    {domainProfiles.slice(0, 6).map((profile) => {
                      const IconComponent = getIcon(profile.icon);
                      return (
                        <a
                          key={profile.id}
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleExternalLink(profile.url, profile.name)}
                          className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group"
                        >
                          <IconComponent size={16} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm">{profile.name}</span>
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Profiles (Remaining domains) */}
          {Object.keys(groupedProfiles).length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <h4 className="font-semibold mb-6 text-center text-gray-300">More Platforms</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedProfiles).slice(3).map(([domainName, domainProfiles]) => {
                  const domain = domains.find(d => d.name === domainName);
                  if (!domain) return null;

                  return (
                    <div key={domainName} className="bg-gray-800 rounded-lg p-4">
                      <h5 className="font-medium mb-3 text-gray-300 capitalize text-sm">
                        {domainName.replace('-', ' ')}
                      </h5>
                      <div className="space-y-2">
                        {domainProfiles.map((profile) => {
                          const IconComponent = getIcon(profile.icon);
                          return (
                            <a
                              key={profile.id}
                              href={profile.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleExternalLink(profile.url, profile.name)}
                              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group text-sm"
                            >
                              <IconComponent size={14} />
                              <span>{profile.name}</span>
                              <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-700 py-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Ayush Rai. All rights reserved.
          </p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            <span className="text-sm">Back to Top</span>
          </button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
