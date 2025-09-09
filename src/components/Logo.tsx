import React from 'react';
// import profileImage from '../assets/E232F4CF-1BC6-4BB4-A659-75BD42299F6E_1_105_c.jpeg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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
