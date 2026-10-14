'use client';

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Play,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Award,
} from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onWatchVideoClick: () => void;
  workshopDate?: string;
  workshopTime?: string;
  duration?: string;
  price?: number;
}

export function HeroSection({
  onRegisterClick,
  onWatchVideoClick,
  workshopDate = 'Saturday, 25 October 2026',
  workshopTime = '6:00 PM IST',
  duration = '2 Hours Live Interactive Session',
  price = 199,
}: HeroSectionProps) {
  const benefits = [
    'Simplify everyday school administration.',
    'Understand more efficient digital workflows.',
    'Explore practical school-management strategies.',
  ];

  return (
    <section id="overview" className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-blue-50/20 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Conversion */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left scroll-reveal-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 self-start bg-blue-50 border border-blue-200/80 rounded-full px-3.5 py-1.5 mb-5 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span className="text-xs font-bold tracking-wider text-blue-900 uppercase">
                GARVI EDUCATION PRESENTS
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-blue-700">Online Workshop</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight leading-[1.15] mb-6">
              Transform the Way You{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600">
                Manage Your School.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-normal">
              Join our practical online workshop to explore smarter approaches to school administration,
              student records, fee management, attendance, and everyday school operations.
            </p>

            {/* 3 Concise Benefit Points */}
            <div className="flex flex-col gap-3.5 mb-9">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 stroke-[2.5]" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <button
                id="hero-primary-cta"
                onClick={onRegisterClick}
                className="animate-vibrate-2s inline-flex items-center justify-center gap-3 bg-[#0A192F] hover:bg-[#152544] text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-xl transition-all duration-200 active:scale-[0.98] group cursor-pointer"
              >
                <span>Register for Just ₹{price}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-video-cta"
                onClick={onWatchVideoClick}
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-6 py-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-blue-700" />
                </div>
                <span>Watch Workshop Preview</span>
              </button>
            </div>

            {/* Truthful Trust Information */}
            <div className="pt-6 border-t border-slate-200/80">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">{workshopDate}</span>
                    <span className="text-slate-500 text-xs">{workshopTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">2 Hours Live</span>
                    <span className="text-slate-500 text-xs">Interactive Q&A included</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Registration: ₹{price}</span>
                    <span className="text-slate-500 text-xs">Official Garvi receipt</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Layered Floating Cards */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 scroll-reveal-right">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer Glow / Framing */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 rounded-3xl blur-lg opacity-70" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white aspect-[4/3] group">
                <Image
                  src="/images/hero-administrator.jpg"
                  alt="Modern Indian school administrator using laptop in school management office"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Subtle gradient overlay at bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Photo Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-world Indian School Case Studies</span>
                  </div>
                  <span className="bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold">
                    Rewa, MP
                  </span>
                </div>
              </div>

              {/* Floating Card 1: Fee Collection Recovery (Top Right) */}
              <div className="animate-float absolute -top-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-xl max-w-[210px] hidden sm:block">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fee Tracking</span>
                </div>
                <div className="text-base font-extrabold text-[#0A192F]">98.4% On-Time</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Automated SMS & WhatsApp reminders</div>
              </div>

              {/* Floating Card 2: Student Attendance Cloud Sync (Bottom Left) */}
              <div className="animate-float-delayed absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-xl max-w-[220px] hidden sm:block">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Daily Records</span>
                </div>
                <div className="text-base font-extrabold text-[#0A192F]">1-Click Digital Sync</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Zero misplaced register sheets</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
