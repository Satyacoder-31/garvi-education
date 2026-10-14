'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  CreditCard,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { captureUtmParamsFromUrl, UtmParams } from '@/lib/utm';
import { fbqTrackLead, fbqTrackInitiateCheckout, fbqTrackPurchase } from '@/components/analytics/meta-pixel';
import { GarviLogo } from './logo';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  price?: number;
  workshopDate?: string;
  workshopTime?: string;
}

export function RegistrationModal({
  isOpen,
  onClose,
  price = 199,
  workshopDate = 'Saturday, 25 October 2026',
  workshopTime = '6:00 PM IST',
}: RegistrationModalProps) {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('School Principal');
  const [consent, setConsent] = useState(true);

  // Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [utmParams, setUtmParams] = useState<UtmParams>({});

  // Sandbox simulation state
  const [sandboxOrderData, setSandboxOrderData] = useState<{
    registrationId: string;
    orderId: string;
    amount: number;
    keyId: string;
  } | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUtmParams(captureUtmParamsFromUrl());
      setErrorMessage('');
      setSandboxOrderData(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!schoolName.trim()) {
      setErrorMessage('Please enter your school or institution name.');
      return;
    }

    if (!city.trim()) {
      setErrorMessage('Please specify your city or district (e.g. Rewa).');
      return;
    }

    if (!consent) {
      setErrorMessage('Please agree to receive workshop details via WhatsApp/Email.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create registration and payment order
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobile: cleanMobile,
          email: email.trim().toLowerCase(),
          schoolName: schoolName.trim(),
          city: city.trim(),
          role,
          ...utmParams,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate registration.');
      }

      // 2. Track Meta Pixel Lead & InitiateCheckout
      fbqTrackLead({ content_name: 'Workshop Registration', school_name: schoolName.trim() }, `lead_${data.registrationId}`);
      fbqTrackInitiateCheckout(price, `initiate_${data.registrationId}`);

      // 3. Check if real Razorpay is available in window
      if (typeof window !== 'undefined' && (window as any).Razorpay && !data.isSandbox && data.keyId !== 'rzp_test_placeholder') {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'Garvi Education',
          description: 'School Management Workshop Fee',
          order_id: data.orderId,
          prefill: {
            name: fullName.trim(),
            email: email.trim(),
            contact: cleanMobile,
          },
          theme: {
            color: '#0A192F',
          },
          handler: async function (response: any) {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registration_id: data.registrationId,
            });
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMessage(resp.error?.description || 'Payment was declined or cancelled. Please try again.');
          setIsLoading(false);
        });
        rzp.open();
      } else {
        // Test / Sandbox mode: Provide immediate simulator so user can verify full flow
        setSandboxOrderData({
          registrationId: data.registrationId,
          orderId: data.orderId,
          amount: data.amount,
          keyId: data.keyId,
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const verifyPayment = async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    registration_id: string;
  }) => {
    setVerifyingPayment(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.verified) {
        throw new Error(result.error || 'Server-side payment verification failed.');
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignore if confetti not supported
      }

      // Track Meta Pixel verified Purchase
      fbqTrackPurchase(price, payload.registration_id, `purchase_${payload.registration_id}`);

      // Redirect to Thank You page
      router.push(`/thank-you?regId=${result.registrationId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification encountered an issue.');
      setVerifyingPayment(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!sandboxOrderData) return;
    await verifyPayment({
      razorpay_order_id: sandboxOrderData.orderId,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      razorpay_signature: `simulated_sig_${sandboxOrderData.orderId}`,
      registration_id: sandboxOrderData.registrationId,
    });
  };

  const handleSimulatePaymentFailure = () => {
    setErrorMessage('Simulated Payment Failure: The transaction was cancelled or declined. You can retry safely.');
    setSandboxOrderData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#0A192F] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close registration modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-4">
            <GarviLogo variant="light" size="sm" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Register for the Workshop
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {workshopDate} • {workshopTime}
          </p>

          <div className="mt-3 inline-flex items-baseline gap-1.5 bg-white/10 px-3 py-1 rounded-lg text-xs">
            <span className="text-slate-300">Registration Fee:</span>
            <span className="text-white font-extrabold text-sm">₹{price}</span>
            <span className="text-emerald-400 font-semibold">• One-time</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sandbox Test Mode Simulation Panel */}
          {sandboxOrderData ? (
            <div className="space-y-4 text-center py-2">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Sandbox Payment Simulator</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Razorpay live API keys are not configured yet. This interactive simulator lets you test the complete registration funnel, server-side signature verification, email/WhatsApp notifications, and the Thank You page.
                </p>
                <div className="mt-2 text-[11px] text-amber-950 font-mono bg-white/80 p-2 rounded border border-amber-200">
                  Order ID: {sandboxOrderData.orderId}
                  <br />
                  Registration ID: {sandboxOrderData.registrationId}
                  <br />
                  Amount: ₹{price}
                </div>
              </div>

              {verifyingPayment ? (
                <div className="py-6 flex flex-col items-center gap-2 text-slate-600">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="text-sm font-semibold">Verifying Payment Server-Side...</span>
                  <span className="text-xs text-slate-400">Triggering WhatsApp & Email confirmation</span>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleSimulatePaymentSuccess}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful ₹{price} Payment</span>
                  </button>

                  <button
                    onClick={handleSimulatePaymentFailure}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
                  >
                    <span>Simulate Payment Failure / Cancel</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Normal Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-12 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="principal@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  School / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saraswati Higher Secondary School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rewa, Satna, Bhopal"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900"
                  >
                    <option value="School Principal">School Principal</option>
                    <option value="School Owner / Director">School Owner / Director</option>
                    <option value="Vice Principal / Academic In-Charge">Vice Principal / Academic Head</option>
                    <option value="Administrative Officer">Administrative Officer</option>
                    <option value="School Trustee">School Trustee</option>
                    <option value="Education Consultant">Education Consultant</option>
                  </select>
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I agree to receive workshop link, schedule updates, and reminders via WhatsApp and Email. View our{' '}
                    <a href="/privacy" target="_blank" className="text-blue-700 underline font-medium">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="animate-vibrate-2s w-full inline-flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white font-black text-sm sm:text-base py-4 px-6 rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment — ₹{price}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Encrypted & Secure Payment Processing</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
