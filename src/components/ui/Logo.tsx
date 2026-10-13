/**
 * Legacy logo: a round profile photo with the name beside it at md and lg sizes.
 *
 * Legacy: not imported anywhere in src/, including the legacy
 * src/components/layout/Header.tsx. Kept for reference; excluded from
 * tsconfig.app.json. No test covers it.
 *
 * The image URL appends `?v=${Date.now()}`, which defeats browser caching and
 * changes the URL on every render; it loads eagerly and falls back to an
 * Unsplash placeholder on error.
 *
 * Connects to:
 * - No importers in src/
 * - /IMG_0029.jpeg from public/
 */
import React from 'react';

/**
 * Logo component props interface.
 */
interface LogoProps {
  /** Size variant: sets the image size and hides the name at `sm` (text size does not change). */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply to the logo container */
  className?: string;
}

/**
 * Renders the photo at 32, 48, or 64px for sm, md, or lg; the name text is
 * omitted at `sm` and is the same size at md and lg. Exported as named and default.
 */
export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-blue-500 shadow-lg`}>
        <img
          src={`/IMG_0029.jpeg?v=${Date.now()}`}
          alt="Ayush Rai"
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            console.error('Logo image failed to load:', e);
            e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face';
          }}
        />
      </div>
      {size !== 'sm' && (
        <span className="font-bold text-gray-800 dark:text-white text-lg">
          Ayush Rai
        </span>
      )}
    </div>
  );
};

export default Logo;
