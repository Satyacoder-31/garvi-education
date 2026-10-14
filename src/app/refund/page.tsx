import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { Footer } from '@/components/footer';

export default function RefundPage() {
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
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Garvi Education • Rewa, Madhya Pradesh, India • Effective Date: October 2026
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700 leading-relaxed text-sm sm:text-base space-y-8">
        
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm">
          At Garvi Education, we maintain a transparent, fair, and professional relationship with all participating school administrators.
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">1. Workshop Registration Fee (₹199)</h2>
          <p>
            The ₹199 registration fee is a nominal administrative fee that covers personalized digital attendance, instructional delivery, framework templates, and verified certificate generation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">2. Cancellation by Participant</h2>
          <p>
            Due to the limited seat capacity (75 seats per batch) and immediate provisioning of administrative resources, registration fees are generally non-refundable once confirmed. However:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>If you are unable to attend due to an institutional emergency, you may request to transfer your registration to a colleague or reschedule to the subsequent batch at zero additional cost by notifying us at least 24 hours prior to the session.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">3. Duplicate Transactions & Technical Errors</h2>
          <p>
            If your account was charged more than once due to a payment gateway lag or network timeout, the duplicate charge will be automatically refunded back to your original payment method within 5–7 banking days via Razorpay.
          </p>
          <p>
            If your registration was not generated despite payment deduction, please email your transaction reference or UPI UTR to <strong>support@garvieducation.com</strong> or WhatsApp our support line at <strong>+91 94251 00000</strong> for priority resolution within 2 hours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">4. Event Cancellation by Garvi Education</h2>
          <p>
            In the rare event that Garvi Education cancels the workshop without providing an alternate date, all registered attendees will receive a 100% full refund credited to their original payment source within 5–7 business days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0A192F]">5. How to Initiate a Query</h2>
          <p>
            Please write to us with your Registration ID and payment screenshot:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <p className="font-bold text-slate-900">Garvi Education Accounts Desk</p>
            <p className="text-slate-600">Email: accounts@garvieducation.com</p>
            <p className="text-slate-600">Helpline: +91 94251 00000 (Mon–Sat, 10 AM – 6 PM IST)</p>
            <p className="text-slate-600">Rewa, Madhya Pradesh 486001</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
