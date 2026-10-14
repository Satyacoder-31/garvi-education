import React from 'react';
import Image from 'next/image';
import { Crown, GraduationCap, Briefcase, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export function WhoShouldAttend({ onRegisterClick }: { onRegisterClick: () => void }) {
  const roles = [
    {
      icon: Crown,
      title: 'School Owners & Directors',
      description:
        'Gain total institutional visibility over fee collections, admissions, and compliance without relying on fragmented verbal updates.',
      badge: 'Strategic Leadership',
    },
    {
      icon: GraduationCap,
      title: 'Principals & Vice Principals',
      description:
        'Reclaim hours spent signing physical registers and resolving parent disputes over misplaced student records or missing circulars.',
      badge: 'Academic Excellence',
    },
    {
      icon: Briefcase,
      title: 'Office & Operations Staff',
      description:
        'Learn how to manage daily attendance, fee receipts, student dossiers, and TC generation smoothly without manual paperwork fatigue.',
      badge: 'Daily Efficiency',
    },
    {
      icon: Building,
      title: 'Education Entrepreneurs & Trustees',
      description:
        'Understand standard operating procedures to scale multiple branches, maintain audit-ready ledgers, and establish high-trust schools.',
      badge: 'Institutional Growth',
    },
  ];

  return (
    <section id="audience" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual of Indian School Leaders */}
          <div className="lg:col-span-5 relative order-2 lg:order-1 scroll-reveal-left">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 aspect-[4/3] bg-slate-100">
              <Image
                src="/images/school-leaders.jpg"
                alt="Panel of Indian school leaders, principals and directors"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-lg text-slate-900 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Curated for Indian School Leaders</span>
                </div>
                <p className="text-slate-600 text-xs">
                  Tailored specifically for CBSE, ICSE, and MP State Board private and public school environments.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Roles Breakdown */}
          <div className="lg:col-span-7 order-1 lg:order-2 scroll-reveal-right">
            <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
              AUDIENCE PROFILE
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Designed for Key Decision Makers in School Administration
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Whether you are managing a 200-student primary school in Rewa or a 3,000-student K-12 campus, the principles taught in this workshop apply directly to your operational workflow.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {roles.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <button
                onClick={onRegisterClick}
                className="animate-vibrate-2s inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <span>Reserve Seat for Your Institution — ₹199</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
