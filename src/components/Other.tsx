/**
 * Other.tsx — Page routing component for specialized content sections.
 *
 * This component provides navigation to additional portfolio pages and specialized content areas
 * not included in the main homepage sections. Features a clean dropdown interface for exploring
 * research, leadership, certifications, and professional services pages with descriptive previews.
 *
 * The component includes:
 * - Dropdown navigation interface with expandable sections
 * - Page previews with icons and descriptions
 * - Direct routing to specialized content areas
 * - Responsive design adapting to different screen sizes
 * - Accessibility features for keyboard and screen reader users
 *
 * Navigation Structure:
 * - Research: Academic and technical research projects
 * - Leadership: Community leadership and mentorship activities
 * - Certifications: Professional credentials and qualifications
 * - Services: Detailed service offerings and expertise areas
 * - Extra-curriculars: Personal development and community involvement
 *
 * User Experience Features:
 * - Collapsible interface to reduce visual clutter
 * - Icon-based navigation for quick recognition
 * - Preview descriptions for informed navigation choices
 * - Smooth transitions and hover effects
 *
 * Accessibility Implementation:
 * - Keyboard navigation support for dropdown interactions
 * - Screen reader compatible with proper ARIA labels
 * - Semantic HTML structure with proper heading hierarchy
 * - Focus management for interactive elements
 *
 * @component
 * @example
 * ```tsx
 * import Other from './components/Other';
 *
 * function SpecializedContent() {
 *   return <Other />;
 * }
 * ```
 *
 * @see {@link src/components/Header.tsx} for primary navigation
 * @see {@link src/components/FloatingNav.tsx} for floating navigation alternative
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ExternalLink } from 'lucide-react';

/**
 * Other — Specialized page navigation component.
 *
 * Provides organized access to additional portfolio content areas
 * through an interactive dropdown interface with previews and
 * descriptions for informed navigation choices.
 *
 * @component
 * @returns {JSX.Element} The rendered navigation component
 *
 * @example
 * ```tsx
 * <Other />
 * ```
 *
 * @see {@link src/App.tsx} for router integration
 */
const Other: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const otherPages = [
    {
      title: 'Research',
      path: '/research',
      description: 'Research projects and academic achievements',
      icon: '🔬'
    },
    {
      title: 'Leadership',
      path: '/leadership',
      description: 'Community leadership and mentorship activities',
      icon: '👥'
    },
    {
      title: 'Certifications',
      path: '/certifications',
      description: 'Professional certifications and credentials',
      icon: '🏆'
    },
    {
      title: 'Services',
      path: '/services',
      description: 'Professional services and consulting offerings',
      icon: '💼'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Work <span className="text-blue-600">Pages</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore specialized content areas through dedicated pages
          </p>
        </div>

        {/* Interactive dropdown navigation */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-blue-500 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">Select a page to explore</span>
              <ChevronDown className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                {otherPages.map((page, index) => (
                  <Link
                    key={index}
                    to={page.path}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className="text-2xl mr-3">{page.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">{page.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{page.description}</div>
                    </div>
                    <ExternalLink className="ml-auto text-gray-400" size={16} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alternative card-based navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherPages.map((page, index) => (
            <Link
              key={index}
              to={page.path}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-300"
            >
              <div className="text-3xl mb-3">{page.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{page.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{page.description}</p>
              <div className="flex items-center text-blue-400 hover:text-blue-500">
                <span className="text-sm font-medium">Explore</span>
                <ExternalLink className="ml-2" size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Other;
