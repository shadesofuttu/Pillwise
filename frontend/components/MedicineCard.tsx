import React from 'react';

interface MedicineCardProps {
  title: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'warning' | 'info';
  children: React.ReactNode;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  title,
  icon,
  variant = 'default',
  children,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-amber-100/50';
      case 'info':
        return 'bg-sky-50 border-2 border-sky-300 text-sky-950 shadow-sky-100/50';
      default:
        return 'bg-white border-2 border-slate-200 text-slate-900 shadow-slate-100';
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-amber-900';
      case 'info':
        return 'text-sky-900';
      default:
        return 'text-slate-900';
    }
  };

  return (
    <section
      aria-label={title}
      className={`rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-200 ${getVariantStyles()}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>}
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getTitleColor()}`}>
          {title}
        </h2>
      </div>
      <div className="text-lg sm:text-xl font-medium leading-relaxed">
        {children}
      </div>
    </section>
  );
};
export default MedicineCard;
