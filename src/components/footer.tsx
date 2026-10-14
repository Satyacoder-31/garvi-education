import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { GarviLogo } from './logo';

export function Footer() {
  return (
    <footer className="bg-[#0A192F] text-white pt-16 pb-12 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <GarviLogo variant="light" size="lg" />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Empowering school directors, principals, and administrative leaders across Madhya Pradesh and India with practical operational frameworks, automated workflows, and high-trust management practices.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Educational Professional Development Provider</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Workshop
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#outcomes" className="hover:text-white transition-colors">
                  Curriculum
                </a>
              </li>
              <li>
                <a href="#agenda" className="hover:text-white transition-colors">
                  Agenda & Timetable
                </a>
              </li>
              <li>
                <a href="#audience" className="hover:text-white transition-colors">
                  Who Should Attend
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 text-xs flex items-center gap-1 mt-3">
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Rewa Support Office
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Civil Lines, Rewa, Madhya Pradesh 486001, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+919425100000" className="hover:text-white">
                  +91 94251 00000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:support@garvieducation.com" className="hover:text-white">
                  support@garvieducation.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Garvi Education. All rights reserved. Rewa, Madhya Pradesh.</p>
          <p>Secure online payment processing via certified gateway.</p>
        </div>

      </div>
    </footer>
  );
}
