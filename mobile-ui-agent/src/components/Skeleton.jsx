import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rectangular',
  animation = true,
  lines = 1,
  spacing = 'space-y-2'
}) => {
  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`;
  
  const variants = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-lg h-32',
    avatar: 'rounded-full w-10 h-10',
    button: 'rounded-lg h-10',
    input: 'rounded-lg h-12'
  };

  const variantClass = variants[variant] || variants.rectangular;

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const animatedStyle = {
    ...skeletonStyle,
    backgroundSize: '200% 100%',
    backgroundPosition: '0% 50%',
  };

  const SkeletonElement = ({ delay = 0 }) => (
    <motion.div
      className={`${baseClasses} ${variantClass}`}
      {...(animation && {
        animate: {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      })}
      style={animatedStyle}
    />
  );

  if (lines === 1) {
    return <SkeletonElement />;
  }

  return (
    <div className={spacing}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonElement key={index} delay={index * 0.1} />
      ))}
    </div>
  );
};

// Predefined skeleton components for common use cases
export const SkeletonCard = ({ className = '' }) => (
  <div className={`p-4 border rounded-lg space-y-3 ${className}`}>
    <Skeleton variant="rectangular" height="8rem" />
    <div className="space-y-2">
      <Skeleton variant="text" width="75%" />
      <Skeleton variant="text" width="50%" />
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }, (_, index) => (
        <Skeleton key={`header-${index}`} variant="text" height="1.5rem" />
      ))}
    </div>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="space-y-2">
      <Skeleton variant="text" width="25%" height="1rem" />
      <Skeleton variant="input" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width="30%" height="1rem" />
      <Skeleton variant="input" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width="20%" height="1rem" />
      <Skeleton variant="rectangular" height="6rem" />
    </div>
    <div className="flex space-x-3">
      <Skeleton variant="button" width="6rem" />
      <Skeleton variant="button" width="6rem" />
    </div>
  </div>
);

export const SkeletonDashboard = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="30%" height="2rem" />
      <Skeleton variant="avatar" />
    </div>
    
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height="2rem" />
        </div>
      ))}
    </div>
    
    {/* Chart area */}
    <div className="space-y-3">
      <Skeleton variant="text" width="25%" />
      <Skeleton variant="rectangular" height="16rem" />
    </div>
    
    {/* Recent activity */}
    <div className="space-y-3">
      <Skeleton variant="text" width="30%" />
      <SkeletonList items={3} />
    </div>
  </div>
);

export default Skeleton;
