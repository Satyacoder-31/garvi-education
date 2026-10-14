import React from 'react';
import { Calendar, Users, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  workshopDate?: string;
  workshopTime?: string;
}

export function AnnouncementBar({
  workshopDate = 'Saturday, 25 October 2026',
  workshopTime = '6:00 PM IST',
}: AnnouncementBarProps) {
  return (
    <div className="bg-[#0A192F] text-white text-xs sm:text-sm py-2.5 px-4 border-b border-blue-900/40 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-flex items-center gap-1.5 bg-blue-600/30 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-400/20">
            <Sparkles className="w-3 h-3 text-cyan-300" /> GARVI EDUCATION
          </span>
          <span className="text-slate-300 font-normal hidden md:inline">|</span>
          <span className="text-slate-100 font-medium">Online School Management Workshop</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white font-medium">{workshopDate}</span>
            <span className="text-slate-400">• {workshopTime}</span>
          </div>
          <span className="hidden lg:inline text-slate-500">|</span>
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>Limited to 75 School Leaders</span>
          </div>
        </div>
      </div>
    </div>
  );
}
