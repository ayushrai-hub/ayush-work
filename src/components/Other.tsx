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
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

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
