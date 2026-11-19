import React from 'react';

interface TrueCareLogoProps {
  variant?: 'header' | 'hero';
  className?: string;
}

export const TrueCareEmblem: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tcShieldNavy" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#123866" />
        <stop offset="100%" stopColor="#081E3B" />
      </linearGradient>
      <linearGradient id="tcShieldGold" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F0CF7A" />
        <stop offset="55%" stopColor="#C89531" />
        <stop offset="100%" stopColor="#9C6F1A" />
      </linearGradient>
    </defs>
    <path
      d="M32 5L54 13.5V30.5C54 44.5 44.6 54.6 32 59C19.4 54.6 10 44.5 10 30.5V13.5L32 5Z"
      fill="url(#tcShieldNavy)"
      stroke="url(#tcShieldGold)"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    {/* Growth Bars */}
    <path d="M21 41V34" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M29.5 41V29" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M38 41V23" stroke="url(#tcShieldGold)" strokeWidth="3.4" strokeLinecap="round" />
    {/* Rising Prosperity Arc */}
    <path
      d="M18.5 29.5C25.5 28 33.5 23.5 42.5 16.5"
      stroke="url(#tcShieldGold)"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <path
      d="M36.5 16H43V22.5"
      stroke="url(#tcShieldGold)"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrueCareLogo: React.FC<TrueCareLogoProps> = ({
  variant = 'header',
  className = '',
}) => {
  if (variant === 'hero') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <TrueCareEmblem className="w-10 h-10 shrink-0" />
        <div className="leading-tight">
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-display text-lg font-semibold tracking-tight text-[#0B2545]">
              True<span className="text-[#B4832D]">Care</span>
            </span>
            <span className="text-slate-300" aria-hidden="true">—</span>
            <span className="text-sm font-semibold text-[#0F172A]">Nilupul Lokuhewage</span>
          </div>
          <p className="text-[11px] font-medium tracking-wider text-slate-500">
            Plan · Protect · Prosper
          </p>
        </div>
      </div>
    );
  }

  // Strict single-line header brand lockup
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${className}`}>
      <TrueCareEmblem className="w-7 h-7 shrink-0" />
      <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-[#0B2545]">
        True<span className="text-[#B4832D]">Care</span>
      </span>
    </span>
  );
};
