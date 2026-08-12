'use client';

import React, { useState, useEffect } from 'react';
import { ScanLine, Brain, FileText } from 'lucide-react';

const steps = [
  { icon: ScanLine, label: 'Reading label' },
  { icon: Brain,    label: 'Identifying medicine' },
  { icon: FileText, label: 'Preparing information' },
];

export const ProgressText: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2200);
    const t2 = setTimeout(() => setStep(2), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const Icon = steps[step].icon;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="min-h-[36px] flex items-center justify-center gap-2 animate-step-in"
    >
      <Icon className="w-4 h-4 text-accent" aria-hidden="true" />
      <p className="font-serif text-lg font-semibold text-ink">
        {steps[step].label}
      </p>
    </div>
  );
};
export default ProgressText;
