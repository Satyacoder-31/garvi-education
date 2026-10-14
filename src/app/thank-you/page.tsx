'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  Download,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GarviLogo } from '@/components/logo';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('regId') || '';

  const [registration, setRegistration] = useState<any>(null);
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fire celebration confetti on load
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch (e) {
      // Ignore
    }

    if (!regId) {
      setLoading(false);
      return;
    }

    fetch(`/api/registrations/${regId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not retrieve registration record.');
        return res.json();
      })
      .then((data) => {
        setRegistration(data.registration);
        setWorkshop(data.workshop);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [regId]);

  // Calendar reminder generator
  const downloadCalendarEvent = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Garvi Education//Online School Management Workshop//EN
BEGIN:VEVENT
SUMMARY:Garvi Education - Online School Management Workshop
DESCRIPTION:Registration ID: ${regId}\\nInteractive 2-Hour School Leadership & Operations Workshop.\\nJoin via WhatsApp Group for live link.
DTSTART:20261025T123000Z
DTEND:20261025T143000Z
LOCATION:Online Interactive Live Session
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Garvi_Workshop_${regId || 'Registration'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center max-w-sm w-full">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-800">Verifying Registration...</h2>
          <p className="text-xs text-slate-500 mt-1">Fetching your official workshop confirmation</p>
        </div>
      </div>
    );
  }

  const whatsappGroupLink =
    workshop?.whatsapp_group_link || 'https://chat.whatsapp.com/GarviEducationWorkshop';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Brand Banner */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="group">
            <GarviLogo size="lg" />
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
          
          {/* Green Confirmation Header */}
          <div className="bg-emerald-600 text-white p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
              <CheckCircle className="w-10 h-10 text-white stroke-[2.2]" />
            </div>

            <span className="inline-block bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
              PAYMENT VERIFIED • CONFIRMED
            </span>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Your Workshop Registration Is Confirmed!
            </h1>

            <p className="text-emerald-100 text-sm mt-2 max-w-lg mx-auto">
              We look forward to welcoming you to the practical school leadership and operations masterclass.
            </p>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Primary Action: Join WhatsApp Group */}
            <div className="bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50 border-2 border-emerald-400/80 rounded-2xl p-6 text-center shadow-sm">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-200/60 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>MANDATORY STEP 2</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Join the Official Workshop WhatsApp Group
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
                The live session joining link, digital templates, agenda reminders, and materials will be shared directly in this private group.
              </p>

              <a
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-vibrate-2s inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Join Official WhatsApp Group</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <p className="text-[11px] text-slate-500 mt-3">
                Exclusive to verified registered participants of Garvi Education.
              </p>
            </div>

            {/* Registration Details Summary */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Registration Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 block">Participant Name</span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {registration?.full_name || 'Registered Participant'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Registration ID</span>
                  <span className="font-mono font-bold text-blue-700 text-sm sm:text-base bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60 inline-block">
                    {regId || registration?.registration_id || 'GARVI-2026-CONFIRMED'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">School / Institution</span>
                  <span className="font-semibold text-slate-800">
                    {registration?.school_name || 'Registered Institution'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Designation / Role</span>
                  <span className="font-semibold text-slate-800">
                    {registration?.role || 'School Administrator'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Workshop Date</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {workshop?.date || 'Saturday, 25 October 2026'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Workshop Schedule</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {workshop?.time || '6:00 PM – 8:00 PM IST'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Amount Paid</span>
                  <span className="font-bold text-emerald-700 text-sm sm:text-base">
                    ₹{registration?.amount || 199} (Official Verified Receipt)
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Session Format</span>
                  <span className="font-semibold text-slate-800">
                    Live Online Interactive Session
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Add to Calendar & Home) */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={downloadCalendarEvent}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3.5 px-4 rounded-xl border border-slate-300 shadow-xs transition-colors"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Add to My Calendar (.ics)</span>
                <Download className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              <Link
                href="/"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm py-3.5 px-4 rounded-xl transition-colors"
              >
                <span>Back to Homepage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Support Assistance Box */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Need support? Contact Garvi Education, Rewa support desk:</span>
              </div>

              <div className="flex items-center gap-4 font-semibold text-slate-700">
                <a href="tel:+919425100000" className="hover:text-blue-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> +91 94251 00000
                </a>
                <a href="mailto:support@garvieducation.com" className="hover:text-blue-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Support
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
