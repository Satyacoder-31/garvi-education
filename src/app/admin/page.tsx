'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  IndianRupee,
  TrendingUp,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Mail,
  MessageSquare,
  LogOut,
  ExternalLink,
  Save,
  RotateCcw,
  BarChart3,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { GarviLogo } from '@/components/logo';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication check
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'settings' | 'notifications'>('overview');

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [totalRegs, setTotalRegs] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Status message
  const [bannerMessage, setBannerMessage] = useState('');

  useEffect(() => {
    // Verify admin session
    fetch('/api/admin/auth')
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          setAuthChecked(true);
          loadAllData();
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, settingsRes, regRes] = await Promise.all([
        fetch('/api/admin/analytics').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json()),
        fetch(`/api/admin/registrations?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`).then((r) => r.json()),
      ]);

      setAnalytics(analyticsRes);
      setSettings(settingsRes.settings);
      setRegistrations(regRes.registrations || []);
      setTotalRegs(regRes.total || 0);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/admin/registrations?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`)
      .then((r) => r.json())
      .then((data) => {
        setRegistrations(data.registrations || []);
        setTotalRegs(data.total || 0);
      });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetch(`/api/admin/registrations?search=${encodeURIComponent(searchQuery)}&status=${status}`)
      .then((r) => r.json())
      .then((data) => {
        setRegistrations(data.registrations || []);
        setTotalRegs(data.total || 0);
      });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setBannerMessage('Settings saved successfully!');
        setTimeout(() => setBannerMessage(''), 4000);
      }
    } catch (e) {
      alert('Failed to save settings');
    }
  };

  const handleResendNotification = async (registrationId: string, channel: 'whatsapp' | 'email') => {
    try {
      const res = await fetch('/api/admin/notifications/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, channel }),
      });
      const data = await res.json();
      if (res.ok) {
        setBannerMessage(`Notification resent to ${channel} for ${registrationId}!`);
        setTimeout(() => setBannerMessage(''), 4000);
        // Refresh analytics / logs
        loadAllData();
      }
    } catch (e) {
      alert('Failed to resend notification.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const summary = analytics?.summary || {
    totalVisitors: 0,
    totalLeads: 0,
    paymentPending: 0,
    paymentFailed: 0,
    verifiedRegistrations: 0,
    totalRevenue: 0,
    conversionRate: '0%',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Top Admin Header */}
      <header className="bg-[#0A192F] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GarviLogo variant="light" size="sm" />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 px-3 py-2 rounded-lg border border-red-800/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'registrations'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registrations ({totalRegs})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Workshop Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notification Logs</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner Alert */}
        {bannerMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{bannerMessage}</span>
          </div>
        )}

        {/* 6 Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Est. Visitors
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {summary.totalVisitors}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Landing page hits</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Leads Submitted
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {summary.totalLeads}
            </div>
            <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Form submitted</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Pending Payment
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
              {summary.paymentPending}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Checkout dropped</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Verified Paid
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {summary.verifiedRegistrations}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Confirmed seats</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Conversion Rate
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1">
              {summary.conversionRate}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Leads to Paid</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Total Revenue
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0A192F] mt-1">
              ₹{summary.totalRevenue}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified via gateway</div>
          </div>
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Meta Ad Campaigns Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Meta Ads & UTM Campaign Performance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time performance tracked via UTM source, campaign, and Meta CAPI
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Campaign Name</th>
                      <th className="py-3 px-4">Traffic Source</th>
                      <th className="py-3 px-4 text-center">Leads</th>
                      <th className="py-3 px-4 text-center">Verified Paid</th>
                      <th className="py-3 px-4 text-right">Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics?.campaigns?.length > 0 ? (
                      analytics.campaigns.map((camp: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {camp.utm_campaign}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium text-xs">
                              {camp.utm_source}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-700">
                            {camp.leads}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">
                            {camp.conversions}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">
                            ₹{camp.revenue}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                          No UTM campaign data recorded yet. Pass ?utm_source=meta&utm_campaign=workshop_launch to track ad sets.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Automation trigger test */}
            <div className="bg-gradient-to-r from-blue-900 to-[#0A192F] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">Workshop Reminder Automation</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Automated notifications sent via Asia/Kolkata timezone to all verified registrants.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    fetch('/api/cron/reminders?type=1_day_before')
                      .then((r) => r.json())
                      .then((d) => alert(`1-Day Reminders processed for ${d.processed} attendees.`));
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20"
                >
                  Test 1-Day Reminder
                </button>
                <button
                  onClick={() => {
                    fetch('/api/cron/reminders?type=1_hour_before')
                      .then((r) => r.json())
                      .then((d) => alert(`1-Hour Reminders processed for ${d.processed} attendees.`));
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md"
                >
                  Test 1-Hour Reminder
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Registrations Management Table */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name, email, mobile, school, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0A192F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700"
                >
                  <option value="">All Statuses</option>
                  <option value="registration_confirmed">Confirmed Paid</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="payment_failed">Payment Failed</option>
                </select>

                <a
                  href={`/api/admin/registrations?export=csv${statusFilter ? `&status=${statusFilter}` : ''}`}
                  download
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </a>
              </div>

            </div>

            {/* Registrations Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Reg ID</th>
                    <th className="py-3 px-3">Participant</th>
                    <th className="py-3 px-3">School & City</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-blue-700 text-xs">
                          {reg.registration_id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{reg.full_name}</div>
                          <div className="text-[11px] text-slate-500">{reg.role}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{reg.school_name}</div>
                          <div className="text-[11px] text-slate-500">{reg.city}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-900 font-mono text-xs">{reg.mobile}</div>
                          <div className="text-[11px] text-slate-500">{reg.email}</div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {reg.status === 'registration_confirmed' || reg.status === 'paid' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                              <CheckCircle className="w-3 h-3" /> Confirmed
                            </span>
                          ) : reg.status === 'payment_failed' ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                              Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ₹{reg.amount}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              title="Resend WhatsApp Confirmation"
                              onClick={() => handleResendNotification(reg.registration_id, 'whatsapp')}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Resend Email Confirmation"
                              onClick={() => handleResendNotification(reg.registration_id, 'email')}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/thank-you?regId=${reg.registration_id}`}
                              target="_blank"
                              title="View Participant Thank You Page"
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No registrations found matching the query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Workshop Settings */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Workshop & Funnel Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Update live workshop dates, WhatsApp group link, pricing, and contact details in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Title
                </label>
                <input
                  type="text"
                  value={settings.workshop_title || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Date (Visible on Landing Page)
                </label>
                <input
                  type="text"
                  value={settings.workshop_date || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Time
                </label>
                <input
                  type="text"
                  value={settings.workshop_time || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_time: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Registration Fee (₹ INR)
                </label>
                <input
                  type="number"
                  value={settings.price || 199}
                  onChange={(e) => setSettings({ ...settings, price: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Approved WhatsApp Group Joining Link
                </label>
                <input
                  type="url"
                  value={settings.whatsapp_group_link || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_group_link: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preview Video Embed URL (e.g. YouTube Embed Link)
                </label>
                <input
                  type="url"
                  value={settings.preview_video_url || ''}
                  onChange={(e) => setSettings({ ...settings, preview_video_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Workshop Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Notification Logs */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Recent Automation & Notification Deliveries
              </h3>
              <p className="text-xs text-slate-500">
                Log of automated AiSensy WhatsApp messages and Resend transactional emails.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3">Registration ID</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics?.recentNotifications?.length > 0 ? (
                    analytics.recentNotifications.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {log.sent_at}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-700">
                          {log.registration_id}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              log.channel === 'whatsapp'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {log.channel.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-slate-700">
                          {log.recipient}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              log.status === 'sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-500 max-w-xs truncate">
                          {log.error_message || 'Delivered successfully'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No notifications sent yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
