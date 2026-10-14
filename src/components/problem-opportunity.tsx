import React from 'react';
import Image from 'next/image';
import { FileX, Clock, IndianRupee, Layers, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

export function ProblemOpportunity({ onRegisterClick }: { onRegisterClick: () => void }) {
  const problems = [
    {
      icon: FileX,
      title: 'Disorganized Student Records',
      description:
        'Physical paper files and scattered spreadsheets make finding student documents, academic histories, and transfer certificates stressful and slow.',
      tag: 'Record Chaos',
    },
    {
      icon: Clock,
      title: 'Time-Consuming Administration',
      description:
        'School leaders spend hours every week managing daily manual registers, repetitive paperwork, and administrative coordination instead of focusing on school growth.',
      tag: 'Administrative Drain',
    },
    {
      icon: IndianRupee,
      title: 'Difficulty Tracking Fee Payments',
      description:
        'Tracking installments, uncollected dues, manual cash receipts, and reconciling bank accounts often results in discrepancies and late fee recovery.',
      tag: 'Revenue Leakage',
    },
    {
      icon: Layers,
      title: 'Challenges in Everyday Operations',
      description:
        'Coordinating staff attendance, timetable adjustments, parent notifications, and board compliance reports across disconnected departments creates friction.',
      tag: 'Operational Friction',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            THE ADMINISTRATIVE CHALLENGE
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            Is School Administration Taking More Time Than It Should?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Managing an educational institution involves hundreds of moving parts. When systems rely on manual registers and fragmented tools, both time and institutional accuracy suffer.
          </p>
        </div>

        {/* Visual Comparison: Traditional Clutter vs Digital Solution */}
        <div className="mb-14 rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Real School Paperwork Photo */}
            <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] scroll-reveal-left">
              <Image
                src="/images/school-paperwork.jpg"
                alt="Traditional Indian school office with stacks of paper attendance registers and admission files"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Traditional Reality</span>
                </div>
                <p className="text-slate-200 text-xs">
                  Hours lost every week hunting through stacks of manual admission files and physical registers.
                </p>
              </div>
            </div>

            {/* Problem Highlight Cards */}
            <div className="lg:col-span-7 p-6 sm:p-8 scroll-reveal-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {problems.map((prob, index) => {
                  const Icon = prob.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4 stroke-[2]" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {prob.tag}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {prob.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* The Opportunity / Solution Box with Modern Visual Elements */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0A192F] via-[#0E2346] to-[#122E5C] text-white p-8 sm:p-12 shadow-xl border border-blue-900/50 relative overflow-hidden scroll-reveal-scale">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60 mb-4">
                THE MODERN WORKFLOW
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Structured Digital Workflows Can Bring Calm and Efficiency to Your School.
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                By organizing student profiles, automating daily attendance logs, and centralizing fee receipts into unified digital systems, school administrators save hours every week, eliminate filing discrepancies, and deliver a modern experience to parents and trustees.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Centralized digital student dossiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real-time fee collection status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Instant parent WhatsApp notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Single dashboard for administrative control</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:items-center lg:items-end justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full text-center">
                <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                  Workshop Registration
                </div>
                <div className="text-3xl font-black text-white my-2">₹199</div>
                <div className="text-xs text-blue-200 mb-5">
                  Live 2-hour interactive workshop + downloadable templates
                </div>
                <button
                  onClick={onRegisterClick}
                  className="animate-vibrate-2s w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Explore the System</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
