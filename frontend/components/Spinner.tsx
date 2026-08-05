import React from 'react';

interface SpinnerProps {
  size?: 'normal' | 'large';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'large' }) => {
  const sizeClasses = size === 'large' ? 'w-20 h-20 border-[6px]' : 'w-10 h-10 border-4';

  return (
    <div
      role="status"
      aria-label="Loading content..."
      className="flex items-center justify-center p-4"
    >
      <div
        className={`${sizeClasses} border-sky-200 border-t-sky-600 rounded-full animate-spin shadow-md`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export default Spinner;
