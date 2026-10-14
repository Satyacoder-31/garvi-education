'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0A192F] text-white py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact & Support
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Get in touch with the Garvi Education academic coordination team in Rewa, Madhya Pradesh.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Official Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                OFFICIAL DESK
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-[#0A192F]">
                Garvi Education Office
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                We are dedicated to supporting school leaders with their administrative workflow and workshop participation.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Headquarters</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Garvi Education, Civil Lines, Rewa, Madhya Pradesh 486001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Phone & WhatsApp Helpline</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    +91 94251 00000
                  </p>
                  <a
                    href="https://wa.me/919425100000?text=Hello%20Garvi%20Education,%20I%20have%20an%20inquiry%20regarding%20the%20workshop."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-semibold text-emerald-600 hover:underline mt-1"
                  >
                    Open in WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Email Inquiries</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    support@garvieducation.com
                  </p>
                  <p className="text-xs text-slate-500">
                    workshops@garvieducation.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operating Hours</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Monday to Saturday: 10:00 AM – 6:00 PM IST
                  </p>
                  <p className="text-xs text-slate-500">
                    Workshop emergency helpline active on session days.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>All payment and workshop inquiries are responded to within 2 to 4 business hours.</span>
            </div>
          </div>

          {/* Right Column: Interactive Support Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
              <h3 className="text-xl font-bold text-[#0A192F] mb-1">
                Send an Administrative Inquiry
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Have a specific question regarding session curriculum or institutional group registration? Let us know below.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-slate-900">Message Received</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                    Thank you. Our workshop coordinator will get in touch with you at {mobile || email} shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-5 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal Anil Mishra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="anil@school.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      School / Institution Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rewa Public Academy"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please tell us about your query regarding the workshop or school management tools..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
