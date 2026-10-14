import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0A192F] text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Garvi Education • Rewa, Madhya Pradesh, India • Effective Date: October 2026
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700 leading-relaxed text-sm sm:text-base space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">1. Agreement to Terms</h2>
          <p>
            By registering for the Online School Management Workshop conducted by Garvi Education, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not complete registration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">2. Workshop Registration & Access</h2>
          <p>
            Registration is valid strictly for the named participant representing the nominated school or institution. Workshop access links, meeting credentials, and WhatsApp community invites are non-transferable and may not be publicly distributed without prior written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">3. Intellectual Property</h2>
          <p>
            All workshop materials, slide presentations, operational blueprints, templates, and frameworks shared during the session remain the proprietary intellectual property of Garvi Education. Participants are granted a non-exclusive license to use these templates within their registered institution for operational purposes. Unauthorized redistribution, resale, or commercial training using our materials is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">4. Participant Conduct</h2>
          <p>
            Participants are expected to maintain professional conduct during live sessions and inside the official WhatsApp group. Disruptive behavior, spamming, unapproved promotional advertising, or inappropriate comments will lead to immediate removal without refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">5. Session Rescheduling & Force Majeure</h2>
          <p>
            In the unforeseen event of technical disruption, severe weather, or unforeseen emergencies affecting instructors, Garvi Education reserves the right to reschedule the workshop to an alternate date. Registered attendees will be notified in advance via WhatsApp and Email.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">6. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India. Any legal disputes arising out of or related to these terms shall fall under the exclusive jurisdiction of the competent courts in Rewa, Madhya Pradesh.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
