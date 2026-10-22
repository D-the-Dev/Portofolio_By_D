import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyber' | 'outline' | 'surface' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyber',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
  };

  const variantStyles = {
    cyber: 'bg-emerald-500/10 text-[#34D399] border border-emerald-500/20 font-mono hover:border-emerald-500/40',
    emerald: 'bg-emerald-500 text-black font-semibold font-mono',
    outline: 'border border-[#1F2924] text-gray-300 font-mono hover:border-emerald-500/40',
    surface: 'bg-[#0F1412] text-gray-300 border border-[#1F2924]',
    muted: 'bg-gray-800/40 text-gray-400 border border-gray-700/30 font-mono',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono transition-colors duration-150 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
