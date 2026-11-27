import React from 'react';

interface TrueCareLogoProps {
  variant?: 'header' | 'hero';
  className?: string;
}

const TRUECARE_LOGO_URL = 'https://i.ibb.co/5h6kSRTc/IMG-20261120-WA0000.jpg';

export const TrueCareEmblem: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <img
    src={TRUECARE_LOGO_URL}
    alt="TrueCare Logo"
    referrerPolicy="no-referrer"
    className={`rounded-xl object-cover shadow-xs ring-1 ring-[#D4A84F]/40 ${className}`}
  />
);

export const TrueCareLogo: React.FC<TrueCareLogoProps> = ({
  variant = 'header',
  className = '',
}) => {
  if (variant === 'hero') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <TrueCareEmblem className="w-11 h-11 shrink-0" />
        <div className="leading-tight">
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-display text-lg font-bold tracking-tight text-[#0B2545]">
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
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <TrueCareEmblem className="w-8 h-8 md:w-9 md:h-9 shrink-0" />
      <span className="font-display text-lg md:text-xl font-bold tracking-tight text-[#0B2545]">
        True<span className="text-[#B4832D]">Care</span>
      </span>
    </span>
  );
};
