'use client';

import React, { useState, useEffect } from 'react';

export const ProgressText: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const messages = [
    'Reading label',
    'Identifying medicine',
    'Preparing information',
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 2000);

    const timer2 = setTimeout(() => {
      setStep(2);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      className="min-h-[40px] flex items-center justify-center"
    >
      <div className="relative inline-flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
        <p className="font-serif text-xl font-semibold text-slate-900 transition-opacity duration-300">
          {messages[step]}
        </p>
      </div>
    </div>
  );
};
export default ProgressText;
