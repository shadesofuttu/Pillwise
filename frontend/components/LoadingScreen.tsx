import React, { useState, useEffect } from 'react';
import { Pill, ScanLine, Brain, FileText } from 'lucide-react';

const steps = [
  { icon: ScanLine, label: 'Reading label' },
  { icon: Brain,    label: 'Identifying medicine' },
  { icon: FileText, label: 'Preparing information' },
];

export const LoadingScreen: React.FC = () => {
  const [step, setStep]       = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimer1 = setTimeout(() => setStep(1), 2200);
    const stepTimer2 = setTimeout(() => setStep(2), 4400);
    return () => { clearTimeout(stepTimer1); clearTimeout(stepTimer2); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 4;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Processing medicine identification"
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[480px] p-10 text-center animate-slide-up"
    >
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-accent-light border border-accent-muted flex items-center justify-center animate-pulse-ring">
          <Pill className="w-10 h-10 text-accent animate-float" aria-hidden="true" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center shadow-card">
          <div className="w-3 h-3 rounded-full bg-accent border-2 border-accent-light animate-ping" />
        </div>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-xs space-y-2.5 mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive   = step === i;
          const isDone     = step > i;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-400 ${
                isActive
                  ? 'bg-accent-light border-accent-muted text-accent'
                  : isDone
                  ? 'bg-white border-border text-ink-muted'
                  : 'bg-white border-border text-ink-muted opacity-40'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className={`text-sm font-medium ${isActive ? 'text-accent' : 'text-ink-secondary'}`}>
                {s.label}
              </span>
              {isDone && (
                <span className="ml-auto text-xs text-ink-muted">✓</span>
              )}
              {isActive && (
                <span className="ml-auto flex gap-0.5">
                  {[0,1,2].map(d => (
                    <span
                      key={d}
                      className="w-1 h-1 rounded-full bg-accent animate-bounce"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2 mb-6">
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-xs text-ink-muted text-right">{progress}%</p>
      </div>

      <p className="text-sm text-ink-secondary leading-relaxed max-w-xs">
        Keep this window open while we securely analyse your medicine image.
      </p>

      {/* sr-only live region */}
      <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
        {steps[step].label} — {progress} percent complete.
      </div>
    </div>
  );
};
export default LoadingScreen;
