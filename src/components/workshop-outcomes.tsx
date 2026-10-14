import React from 'react';
import Image from 'next/image';
import {
  Building2,
  FolderLock,
  UserCheck,
  CreditCard,
  MessageSquare,
  Compass,
  ArrowRight,
  Sparkles,
  MonitorCheck,
} from 'lucide-react';

export function WorkshopOutcomes({ onRegisterClick }: { onRegisterClick: () => void }) {
  const outcomes = [
    {
      icon: Building2,
      number: '01',
      title: 'School Management Fundamentals',
      description:
        'Discover the foundational principles of modern educational administration: role-based access control, institutional data privacy, and organizing your school’s digital backbone.',
      highlights: ['Administrative hierarchy', 'Staff permissions', 'Operational security'],
      gradient: 'from-blue-600/10 to-indigo-600/5',
      accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      icon: FolderLock,
      number: '02',
      title: 'Student Information & Records',
      description:
        'Learn how to establish tamper-proof digital dossiers for every enrolled student — from digital admission forms and KYC documents to academic performance and transfer certificates.',
      highlights: ['Instant record search', 'Digital document vault', 'Zero physical misplacements'],
      gradient: 'from-indigo-600/10 to-purple-600/5',
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      icon: UserCheck,
      number: '03',
      title: 'Attendance & Administrative Workflows',
      description:
        'Examine streamlined daily attendance tracking for students and staff. Eliminate handwritten daily attendance registers and configure automated absence alerts for parents.',
      highlights: ['Daily absence tracking', 'Staff leave management', 'Automated parent alerts'],
      gradient: 'from-sky-600/10 to-cyan-600/5',
      accentColor: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      icon: CreditCard,
      number: '04',
      title: 'Fee Management & Reporting',
      description:
        'Understand structured fee-collection mechanisms: tracking installments, automated digital receipts, identifying overdue balances, and generating audit-ready financial summaries.',
      highlights: ['Automated payment receipts', 'Defaulter tracking lists', 'Financial reconciliation'],
      gradient: 'from-emerald-600/10 to-teal-600/5',
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: MessageSquare,
      number: '05',
      title: 'Digital Communication & Coordination',
      description:
        'Explore how leading institutions utilize official WhatsApp and SMS notifications to communicate circulars, exam dates, emergency alerts, and homework with parents effortlessly.',
      highlights: ['One-click circulars', 'WhatsApp updates', 'High parent satisfaction'],
      gradient: 'from-cyan-600/10 to-blue-600/5',
      accentColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      icon: Compass,
      number: '06',
      title: 'Practical Implementation Strategies',
      description:
        'Gain actionable steps to smoothly introduce digital tools to your teaching and administrative staff without overwhelming them or disrupting daily classes.',
      highlights: ['Overcoming tech resistance', 'Staff onboarding roadmap', 'Step-by-step rollout'],
      gradient: 'from-amber-600/10 to-orange-600/5',
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <section id="outcomes" className="py-24 bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            CURRICULUM BREAKDOWN
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            What You’ll Explore in This Workshop
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A comprehensive, practical exploration of core school administrative pillars designed specifically for Indian private, public, and semi-urban educational institutions.
          </p>
        </div>

        {/* Visual Live Operations Showcase Banner */}
        <div className="mb-14 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-[#0A192F] relative group scroll-reveal-scale">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full min-h-[220px]">
            <Image
              src="/images/school-operations.jpg"
              alt="Live school management operations and administrative dashboard"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover group-hover:scale-102 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
                  <MonitorCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Real-World System Walkthrough</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-white">
                  6 Core Pillars of Modern Institutional Management
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                  Explore how digital registers, automatic fee balance receipts, and SMS/WhatsApp parent alerts operate harmoniously.
                </p>
              </div>

              <button
                onClick={onRegisterClick}
                className="animate-vibrate-2s self-start sm:self-auto bg-white text-[#0A192F] hover:bg-slate-100 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Join Workshop — ₹199
              </button>
            </div>
          </div>
        </div>

        {/* 6-Card Grid with Visual Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            const revealDir = idx % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right';
            return (
              <div
                key={item.number}
                className={`bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${revealDir}`}
              >
                {/* Visual subtle gradient corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.gradient} rounded-bl-full pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${item.accentColor}`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-slate-400 tracking-wider">
                      MODULE {item.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A192F] mb-3 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Workshop Topics:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/70 font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Prompt with Vibrating Button */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white p-4 sm:px-8 sm:py-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Ready to learn actionable operational workflows for your school?
            </span>
            <button
              onClick={onRegisterClick}
              className="animate-vibrate-2s inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Join Workshop for ₹199</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
