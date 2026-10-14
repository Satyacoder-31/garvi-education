'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone } from 'lucide-react';

interface StickyMobileCtaProps {
  onRegisterClick: () => void;
  price?: number;
}

export function StickyMobileCta({ onRegisterClick, price = 199 }: StickyMobileCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 300px
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col pl-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Registration Fee
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#0A192F]">₹{price}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Live Workshop</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <a
            href="https://wa.me/919425100000?text=Hello%20Garvi%20Education,%20I%20have%20an%20inquiry%20about%20the%20School%20Management%20Workshop."
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0"
            aria-label="WhatsApp Inquiry"
          >
            <Phone className="w-5 h-5" />
          </a>

          <button
            onClick={onRegisterClick}
            className="animate-vibrate-2s flex-1 inline-flex items-center justify-center gap-2 bg-[#0A192F] active:bg-[#152544] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg cursor-pointer"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
