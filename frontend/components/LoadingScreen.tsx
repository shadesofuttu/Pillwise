import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ProgressText from './ProgressText';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate progress for better UX
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Processing medicine identification"
      className="w-full max-w-lg mx-auto flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-3xl border-2 border-slate-200 shadow-xl space-y-8 my-8 animate-slide-up"
    >
      <div className="relative">
        <Spinner size="large" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-600">{progress}%</span>
        </div>
      </div>
      
      <div className="w-full max-w-xs space-y-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <ProgressText />
      </div>
      
      <div className="space-y-4">
        <p className="text-slate-600 text-lg sm:text-xl font-medium max-w-sm">
          Please keep this window open while we process your medicine image securely.
        </p>
        <p className="text-sm text-slate-500 max-w-xs">
          Analyzing image → Extracting text → Identifying medicine → Gathering information
        </p>
      </div>
      
      {/* Hidden loading announcements for screen readers */}
      <div 
        role="status" 
        aria-live="assertive" 
        aria-atomic="true"
        className="sr-only"
      >
        Processing medicine identification. {progress} percent complete.
      </div>
    </div>
  );
};
export default LoadingScreen;
