import React from 'react';

interface SpinnerProps {
  size?: 'normal' | 'large';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'large' }) => {
  const sizeClasses = size === 'large' ? 'w-12 h-12 border-[3px]' : 'w-6 h-6 border-2';
  return (
    <div
      role="status"
      aria-label="Loading content..."
      className="flex items-center justify-center"
    >
      <div
        className={`${sizeClasses} border-accent-muted border-t-accent rounded-full animate-spin`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export default Spinner;
