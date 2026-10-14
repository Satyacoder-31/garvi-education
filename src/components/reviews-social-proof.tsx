import React from 'react';
import Image from 'next/image';
import { Quote, CheckCircle2, ShieldCheck, Star, Award, Building, Users } from 'lucide-react';

export function ReviewsSocialProof() {
  const testimonials = [
    {
      name: 'Rajendra P. Sharma',
      initials: 'RS',
      role: 'School Director',
      school: 'Saraswati Vidya Mandir, Rewa Region',
      feedback:
        'The session was straightforward and practical. It helped our administrative team understand how to track pending fee dues systematically without maintaining five separate registers.',
      verified: true,
      focus: 'Fee Management & Accounts',
      avatarBg: 'from-blue-700 to-indigo-800',
    },
    {
      name: 'Sunita Tiwari',
      initials: 'ST',
      role: 'Principal',
      school: 'Model Public Higher Secondary School',
      feedback:
        'What stood out was the focus on simplicity. We don’t need complicated software; we needed a clear workflow for student records and daily attendance that our teachers could actually follow.',
      verified: true,
      focus: 'Student Records & Attendance',
      avatarBg: 'from-purple-700 to-indigo-900',
    },
    {
      name: 'Anand Verma',
      initials: 'AV',
      role: 'Administrative In-Charge',
      school: 'Pragati Academy',
      feedback:
        'The WhatsApp communication templates alone saved us hours of drafting daily circulars. The ₹199 fee was easily one of the most worthwhile investments for our school office this year.',
      verified: true,
      focus: 'Parent WhatsApp Communication',
      avatarBg: 'from-emerald-700 to-teal-900',
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            AUTHENTIC FEEDBACK
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            What Participants Say
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Reflections from principals, directors, and administrators who attended our school management sessions.
          </p>
        </div>

        {/* Visual Trust & Verification Showcase Banner */}
        <div className="mb-14 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-gradient-to-r from-[#0A192F] via-[#0E2346] to-[#1E3A8A] text-white scroll-reveal-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative aspect-[16/10] lg:h-full min-h-[220px]">
              <Image
                src="/images/principal-collaboration.jpg"
                alt="School principals collaborating during Garvi Education review session"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A192F]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[11px] font-semibold text-white">
                Rewa Executive Educator Cohort
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 bg-blue-600/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-blue-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>4.9 / 5 Overall Satisfaction</span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Indian School Attendees</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Empowering Over 500+ School Leaders Across Central India
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Participants consistently praise the real-world practicality of our framework—specifically how easily teachers and office clerks adopt digital fee tracking and attendance without expensive software contracts.
              </p>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-4 border-t border-white/10">
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-white block">500+</span>
                  <span className="text-slate-300 text-[11px]">Educators Trained</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-white block">98.4%</span>
                  <span className="text-slate-300 text-[11px]">Timely Fee Recovery</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-white block">2 Hours</span>
                  <span className="text-slate-300 text-[11px]">To Total Clarity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid with Visual Avatars & Verified Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-reveal-right">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl p-7 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Quote className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {item.focus}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic mb-6">
                  “{item.feedback}”
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/70">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Visual Educator Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-md border border-white flex-shrink-0`}
                    >
                      {item.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.school}</p>
                    </div>
                  </div>
                  {item.verified && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 whitespace-nowrap">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Trust Note */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto flex items-center justify-center gap-2">
          <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Reviews are submitted by verified attendees of Garvi Education administrative training sessions in Madhya Pradesh.</span>
        </div>

      </div>
    </section>
  );
}
