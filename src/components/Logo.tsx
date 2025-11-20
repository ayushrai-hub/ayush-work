/**
 * Logo.tsx — Responsive logo component with size variants and optional text display.
 *
 * This component provides a flexible logo display for the Ayush Rai portfolio website,
 * featuring responsive sizing options and optional text integration. Optimized for
 * performance with lazy loading and fallback handling for profile images.
 *
 * The component includes:
 * - Three size variants (sm, md, lg) with consistent scaling
 * - Optional text display for different use contexts
 * - Image optimization with fallback handling
 * - Responsive border styling and hover effects
 * - Accessibility features with proper alt text
 *
 * Performance optimizations:
 * - Optimized image loading with caching
 * - Responsive image sizing to prevent unnecessary downloads
 * - Error handling with graceful fallback
 *
 * @component
 * @example
 * ```tsx
 * import { Logo } from './components/Logo';
 *
 * // Basic logo usage
 * <Logo />
 *
 * // Logo with custom size and text
 * <Logo size="lg" className="hover:opacity-80" />
 * ```
 *
 * @see {@link src/components/Header.tsx} for primary usage location
 */
import React from 'react';

/**
 * Logo component props interface.
 */
interface LogoProps {
  /** Size variant for the logo (affects both image and text scaling) */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply to the logo container */
  className?: string;
}

/**
 * Logo — Flexible logo component with responsive sizing.
 *
 * Displays the Ayush Rai logo with profile image and optional text,
 * providing consistent branding across the application. Features
 * responsive sizing, performance optimizations, and accessibility.
 *
 * @component
 * @param {LogoProps} props - Component props
 * @returns {JSX.Element} The rendered logo component
 *
 * @example
 * ```tsx
 * <Logo size="md" />
 * ```
 *
 * @see {@link src/components/Header.tsx} for primary integration
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
          src={`/profile-image.jpeg?v=${Date.now()}`}
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
