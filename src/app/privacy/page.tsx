import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Garvi Education • Rewa, Madhya Pradesh, India • Effective Date: October 2026
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700 leading-relaxed text-sm sm:text-base space-y-8">
        
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <span>
            Garvi Education values your privacy. We collect only information necessary to process your workshop registration and facilitate your attendance in accordance with the Information Technology Act, 2000 (India).
          </span>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">1. Information We Collect</h2>
          <p>
            When you register for the Online School Management Workshop, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Personal Contact Information:</strong> Full name, 10-digit mobile number, and email address.</li>
            <li><strong>Institutional Information:</strong> School/Institution name, city/district, and administrative role or designation.</li>
            <li><strong>Transaction Identifiers:</strong> Razorpay order ID, payment transaction ID, timestamp, and amount paid (₹199). We do <em>not</em> store debit/credit card numbers or UPI MPINs on our servers.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, and UTM attribution parameters to measure ad campaign performance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">2. How We Use Your Information</h2>
          <p>The collected information is used solely for:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Generating your official registration ID and sending payment receipts.</li>
            <li>Delivering workshop access credentials, meeting links, and downloadable resources via Email and WhatsApp (via AiSensy).</li>
            <li>Sending timely session reminders (1 day and 1 hour before the live workshop).</li>
            <li>Issuing your personalized Certificate of Participation.</li>
            <li>Providing customer support regarding technical issues or payment reconciliations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">3. WhatsApp & Email Communications</h2>
          <p>
            By opting into registration, you consent to receive transactional and operational communications from Garvi Education via WhatsApp and Email. You may opt out of promotional messages at any time by replying "STOP" or notifying support@garvieducation.com.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">4. Data Protection & Non-Disclosure</h2>
          <p>
            We strictly do <strong>not</strong> sell, rent, or trade participant data to any third-party marketing companies. Data is shared strictly with certified infrastructure providers (such as Razorpay for secure payment processing and AiSensy for transactional WhatsApp delivery).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">5. Grievance Officer & Contact</h2>
          <p>
            For any inquiries, data deletion requests, or questions regarding this Privacy Policy, please contact our Grievance Officer:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <p className="font-bold text-slate-900">Garvi Education Legal & Grievance Desk</p>
            <p className="text-slate-600">Civil Lines, Rewa, Madhya Pradesh 486001, India</p>
            <p className="text-slate-600">Email: legal@garvieducation.com / support@garvieducation.com</p>
            <p className="text-slate-600">Phone: +91 94251 00000</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
