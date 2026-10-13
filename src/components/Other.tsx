/**
 * Legacy "Work Pages" section: a row of router links to secondary pages.
 *
 * Legacy: not imported by the current site (src/App.tsx routes use src/pages).
 * Kept for reference; excluded from tsconfig.app.json. No test covers it.
 *
 * It is a static list of five react-router `Link`s, not a dropdown, and has no
 * ARIA attributes. The targets still resolve in src/App.tsx, but no longer to
 * the legacy pages in src/components/pages: /research and /leadership render
 * src/pages components, /services redirects to /contact, /certifications to
 * /recognition, and /extracurriculars to /leadership.
 *
 * Connects to:
 * - No importers in src/
 * - react-router-dom `Link` (requires a router ancestor), lucide-react
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

/**
 * Renders `<section id="work">` with one link per `otherPages` entry. The
 * `description` field is defined but not rendered.
 */
const Other: React.FC = () => {
  const otherPages = [
    {
      title: 'Research',
      path: '/research',
      description: 'Research projects',
      icon: '🔬'
    },
    {
      title: 'Leadership',
      path: '/leadership',
      description: 'Community leadership',
      icon: '👥'
    },
    {
      title: 'Certifications',
      path: '/certifications',
      description: 'Certifications',
      icon: '🏆'
    },
    {
      title: 'Services',
      path: '/services',
      description: 'Services & Solutions',
      icon: '💼'
    },
    {
      title: 'Extra-curriculars',
      path: '/extracurriculars',
      description: 'Extra-curriculars',
      icon: '🎯'
    }
  ];

  return (
    <section id="work" className="py-8 md:py-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Work <span className="text-blue-600">Pages</span>
          </h2>
          <div className="w-16 h-0.5 bg-blue-600 mx-auto rounded-full mb-3"></div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Explore specialized content areas
          </p>
        </div>

        {/* Compact button grid */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
          {otherPages.map((page, index) => (
            <Link
              key={index}
              to={page.path}
              className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-sm md:text-base group"
            >
              <span className="text-base md:text-lg mr-1.5 md:mr-2">{page.icon}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {page.title}
              </span>
              <ExternalLink className="ml-1.5 md:ml-2 text-gray-400 group-hover:text-blue-500 transition-colors" size={12} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Other;
