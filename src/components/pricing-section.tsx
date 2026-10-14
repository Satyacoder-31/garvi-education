import React from 'react';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, ArrowRight, Lock, Sparkles, Award, FileSpreadsheet } from 'lucide-react';

interface PricingSectionProps {
  onRegisterClick: () => void;
  price?: number;
  workshopDate?: string;
  workshopTime?: string;
}

export function PricingSection({
  onRegisterClick,
  price = 199,
  workshopDate = 'Saturday, 25 October 2026',
  workshopTime = '6:00 PM IST',
}: PricingSectionProps) {
  const inclusions = [
    'Live 2-Hour Interactive Digital Workshop',
    'Downloadable School Operations Blueprint & SOP Checklist',
    'Official Attendance & Fee Ledger Digital Templates',
    'Instant Access to Garvi Education Leadership WhatsApp Group',
    'Direct Interactive Q&A with Educational Workflow Specialists',
    'Verified Certificate of Participation from Garvi Education',
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            START YOUR REGISTRATION
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            Join the Garvi Education Workshop
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Transparent, straightforward pricing for school leaders across Madhya Pradesh.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl border-2 border-blue-600/30 shadow-2xl overflow-hidden relative scroll-reveal-scale">
          
          {/* Top highlight bar */}
          <div className="bg-[#0A192F] text-white py-3.5 px-6 flex flex-wrap items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Executive School Management Series</span>
            </div>
            <div className="text-slate-300 font-medium">
              {workshopDate} • {workshopTime}
            </div>
          </div>

          <div className="p-8 sm:p-12">
            
            {/* Visual Certificate & Toolkit Showcase Card */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-blue-200 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50/40 scroll-reveal-left">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                <div className="sm:col-span-5 relative aspect-[16/10] sm:h-full min-h-[170px]">
                  <Image
                    src="/images/certificate-toolkit.jpg"
                    alt="Garvi Education Certificate of Completion and School Management Toolkit"
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>
                <div className="sm:col-span-7 p-5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100/70 px-2.5 py-0.5 rounded">
                      Included with ₹{price} Registration
                    </span>
                    <span className="text-xs font-bold text-slate-500 line-through">
                      ₹1,499 Value
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Verified Certificate & Digital Operations Toolkit
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Personalized institutional certificate issued to your name, plus ready-to-deploy digital fee sheets and attendance registers.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-8 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#0A192F]">
                  Complete Workshop Registration
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  One-time workshop registration fee with lifetime access to resources.
                </p>
              </div>

              <div className="sm:text-right">
                <div className="flex items-baseline sm:justify-end gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
                    ₹{price}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / one-time
                  </span>
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  No recurring charges or hidden fees
                </div>
              </div>
            </div>

            {/* Inclusions List */}
            <div className="py-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
                Confirmed Workshop Inclusions:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA and Security with 2-Second Vibration */}
            <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
              <button
                id="pricing-cta-btn"
                onClick={onRegisterClick}
                className="animate-vibrate-2s w-full sm:w-auto sm:min-w-[340px] inline-flex items-center justify-center gap-3 bg-[#0A192F] hover:bg-[#152544] text-white font-black text-base px-8 py-4 rounded-xl shadow-2xl transition-all active:scale-95 group cursor-pointer"
              >
                <span>Secure My Registration — ₹{price}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 text-center">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Secure payment processing. Registration confirmation after successful payment verification.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
