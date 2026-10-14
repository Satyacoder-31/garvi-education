import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export function GarviLogo({
  className = '',
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem Icon */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-[#0A192F] via-[#1E3A8A] to-[#2563EB] flex items-center justify-center p-0.5 shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform duration-200 border border-blue-400/30 flex-shrink-0`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 drop-shadow-sm"
        >
          {/* Shield Outline */}
          <path
            d="M24 4L7 11V22C7 32.5 14.2 42.1 24 44C33.8 42.1 41 32.5 41 22V11L24 4Z"
            fill="url(#emblem-gradient)"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Open Book Base */}
          <path
            d="M14 26C17 25 21 25.5 24 28C27 25.5 31 25 34 26V35C31 34 27 34.5 24 37C21 34.5 17 34 14 35V26Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          {/* Book Spine Divider */}
          <path d="M24 28V37" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Rising Sun / Torch Rays */}
          <path
            d="M24 13V18M18 15L20.5 19M30 15L27.5 19"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Flame / Diamond */}
          <path
            d="M24 16L26 19.5H22L24 16Z"
            fill="#FACC15"
          />
          <defs>
            <linearGradient id="emblem-gradient" x1="7" y1="4" x2="41" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="0.5" stopColor="#1E3A8A" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center">
        <div
          className={`font-black ${textSizes[size]} tracking-tight leading-none ${
            isLight ? 'text-white' : 'text-[#0A192F]'
          }`}
          style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
        >
          GARVI EDUCATION
        </div>
        {showSubtitle && (
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase mt-1 ${
              isLight ? 'text-blue-200' : 'text-slate-500'
            }`}
          >
            Rewa, Madhya Pradesh
          </span>
        )}
      </div>
    </div>
  );
}
