'use client';

import React, { useEffect, useState } from 'react';
import { GarviLogo } from './logo';
import { Sparkles } from 'lucide-react';

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Run loading bar progression on every page mount / refresh
    let current = 0;
    const interval = setInterval(() => {
      // Natural variable acceleration
      const increment = current < 30 ? 6 : current < 70 ? 10 : current < 90 ? 7 : 4;
      current = Math.min(100, current + increment);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsCompleted(true);
          // Remove from DOM after the slide-up curtain animation finishes
          setTimeout(() => setIsRemoved(true), 750);
        }, 220);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#0A192F] text-white transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isCompleted ? '-translate-y-full opacity-95 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      aria-hidden={isCompleted}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,78,216,0.22)_0,transparent_70%)] pointer-events-none" />

      {/* Decorative top glide bar indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm w-full text-center">
        
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 to-cyan-500/30 rounded-3xl blur-xl animate-pulse" />
          <div className="relative bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
            <GarviLogo variant="light" size="lg" />
          </div>
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/70 px-3.5 py-1 rounded-full border border-cyan-800/50 mb-3">
          <Sparkles className="w-3 h-3 text-cyan-300" />
          <span>Rewa, Madhya Pradesh</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
          Garvi Education
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          School Leadership & Operations Masterclass
        </p>

        {/* Central Loading Bar */}
        <div className="w-full bg-slate-800/90 rounded-full h-2 p-0.5 border border-slate-700/80 shadow-inner overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 transition-all duration-100 ease-out shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter and Status */}
        <div className="flex items-center justify-between w-full mt-3 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Initializing Portal...</span>
          <span className="font-bold text-cyan-300 text-xs">{progress}%</span>
        </div>

      </div>

      {/* Bottom Security Note */}
      <div className="absolute bottom-6 text-[11px] text-slate-500 font-medium">
        Secure Academic Operations Platform • 2026
      </div>
    </div>
  );
}
