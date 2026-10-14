'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';

interface FaqAccordionProps {
  price?: number;
  workshopDate?: string;
}

export function FaqAccordion({ price = 199, workshopDate = 'Saturday, 25 October 2026' }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Who can attend this workshop?',
      answer:
        'This workshop is designed for school owners, directors, principals, vice-principals, administrative coordinators, and office managers of primary, secondary, and higher secondary schools across Madhya Pradesh and India. Whether your school has 150 students or 2,500 students, the administrative principles apply directly.',
    },
    {
      question: 'Is the workshop conducted online?',
      answer:
        'Yes. The workshop is conducted 100% online via a secure, interactive live video session. You can join conveniently from your office laptop, desktop, tablet, or smartphone from anywhere in Rewa, MP, or nationwide.',
    },
    {
      question: 'What will I learn?',
      answer:
        'You will explore practical school management strategies: structuring digital student records and dossiers, managing multi-period attendance, tracking fee collections and pending dues, automating parent WhatsApp and SMS circulars, and creating standard operating procedures for everyday school administration.',
    },
    {
      question: 'How much does registration cost?',
      answer: `Registration is a one-time fixed fee of ₹${price}. There are no hidden fees, recurring subscriptions, or surprise software charges. This includes full access to the live 2-hour session, digital templates, and the WhatsApp community.`,
    },
    {
      question: 'How do I complete registration?',
      answer:
        'Click any "Register Now" button on this page. Enter your name, mobile number, email, school name, and city. You will be guided through secure online payment (UPI, debit/credit cards, or net banking). Upon successful payment verification, your registration is immediately confirmed.',
    },
    {
      question: 'How will I receive workshop details?',
      answer:
        'Immediately after payment verification, you will receive an official confirmation on the screen with your unique Registration ID. You will also receive an instant confirmation via WhatsApp and email containing your session schedule and instructions.',
    },
    {
      question: 'How do I join the WhatsApp group?',
      answer:
        'On your post-registration confirmation page (Thank You page) and inside your confirmation email and WhatsApp message, an exclusive direct invite link to the official Garvi Education WhatsApp Group is provided. Simply click the link to join the community.',
    },
    {
      question: 'What if my payment succeeds but registration is not confirmed?',
      answer:
        'Our system uses secure server-side payment verification. In rare cases where your network drops during payment, our automated webhook synchronizes with the payment gateway within seconds to verify and confirm your seat. If you ever need manual assistance, our Rewa support helpline (+91 94251 00000 / support@garvieducation.com) will immediately verify your transaction and issue your registration ID.',
    },
    {
      question: 'Will I receive reminders before the workshop?',
      answer: `Yes. To ensure you don't miss the session, our automated system sends reminders via WhatsApp and email 1 day before the workshop and 1 hour before we go live on ${workshopDate}, complete with the direct meeting joining link.`,
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            Have Questions? We Have Answers.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Everything you need to know about the Garvi Education School Management Workshop.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 scroll-reveal-up">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-blue-300 bg-blue-50/20 shadow-md'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg text-[#0A192F]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-blue-600 text-white rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more help visual support box with coordinator photo */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-[#0A192F] via-[#0E2346] to-[#1E3A8A] text-white p-6 sm:p-8 shadow-xl border border-blue-900/40 overflow-hidden scroll-reveal-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              <Image
                src="/images/support-coordinator.jpg"
                alt="Garvi Education academic coordinator at Rewa support desk"
                fill
                sizes="(max-width: 768px) 100vw, 250px"
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-semibold text-white text-center">
                Rewa Coordination Desk
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-2 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                  <span>Direct Rewa Support Desk</span>
                </div>
                <h4 className="font-extrabold text-white text-lg sm:text-xl">
                  Still have questions before registering?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Our academic coordination team in Rewa is available Mon–Sat to assist your school with registration, payment verification, or group bookings.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/919425100000?text=Hello%20Garvi%20Education,%20I%20have%20a%20question%20about%20the%20School%20Management%20Workshop."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-vibrate-2s inline-flex items-center gap-2 text-sm font-bold text-[#0A192F] bg-white hover:bg-slate-100 px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
                <span className="text-xs text-slate-400">
                  Official Helpline: +91 94251 00000
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
