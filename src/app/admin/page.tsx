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
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Phone,
  Building,
  MapPin,
  Calendar,
  X,
  HelpCircle,
  Check,
  RefreshCw,
  Globe,
  Sparkles,
} from 'lucide-react';
import { GarviLogo } from '@/components/logo';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication check
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'razorpay' | 'settings' | 'inquiries' | 'notifications'>('overview');

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [totalRegs, setTotalRegs] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Status message banner
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    fullName: '',
    mobile: '',
    email: '',
    schoolName: '',
    city: 'Rewa',
    role: 'School Administrator',
    amount: 199,
    status: 'registration_confirmed',
  });

  const showBanner = (text: string, type: 'success' | 'error' = 'success') => {
    setBannerMessage({ text, type });
    setTimeout(() => setBannerMessage(null), 5000);
  };

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
      const [analyticsRes, settingsRes, regRes, inquiriesRes] = await Promise.all([
        fetch('/api/admin/analytics').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json()),
        fetch(`/api/admin/registrations?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`).then((r) => r.json()),
        fetch('/api/admin/contacts').then((r) => r.json()).catch(() => ({ messages: [] })),
      ]);

      setAnalytics(analyticsRes);
      setSettings(settingsRes.settings);
      setRegistrations(regRes.registrations || []);
      setTotalRegs(regRes.total || 0);
      setInquiries(inquiriesRes.messages || []);
    } catch (e) {
      console.error('Error loading admin data:', e);
      showBanner('Failed to load fresh dashboard data', 'error');
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
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        showBanner('Website settings & credentials saved successfully!');
      } else {
        showBanner(data.error || 'Failed to save settings', 'error');
      }
    } catch (e) {
      showBanner('Network error while saving settings', 'error');
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
        showBanner(`Notification queued for ${channel.toUpperCase()} (${registrationId})!`);
        loadAllData();
      } else {
        showBanner(data.error || 'Failed to resend notification', 'error');
      }
    } catch (e) {
      showBanner('Failed to trigger notification dispatch', 'error');
    }
  };

  const handleQuickStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, updates: { status: newStatus } }),
      });
      if (res.ok) {
        showBanner(`Updated status of ${registrationId} to ${newStatus}`);
        loadAllData();
      }
    } catch (e) {
      showBanner('Failed to update status', 'error');
    }
  };

  const handleDeleteUser = async (registrationId: string) => {
    if (!confirm(`Are you sure you want to delete registration ${registrationId}? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/registrations?registrationId=${registrationId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showBanner(`Registration ${registrationId} deleted successfully`);
        if (viewingUser?.registration_id === registrationId) setViewingUser(null);
        loadAllData();
      }
    } catch (e) {
      showBanner('Failed to delete registration', 'error');
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        showBanner(`User ${data.registration?.full_name} registered successfully! ID: ${data.registration?.registration_id}`);
        setIsAddUserOpen(false);
        setNewUser({
          fullName: '',
          mobile: '',
          email: '',
          schoolName: '',
          city: 'Rewa',
          role: 'School Administrator',
          amount: 199,
          status: 'registration_confirmed',
        });
        loadAllData();
      } else {
        showBanner(data.error || 'Failed to add user', 'error');
      }
    } catch (e) {
      showBanner('Error creating user record', 'error');
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: editingUser.registration_id,
          updates: {
            full_name: editingUser.full_name,
            mobile: editingUser.mobile,
            email: editingUser.email,
            school_name: editingUser.school_name,
            city: editingUser.city,
            role: editingUser.role,
            status: editingUser.status,
            amount: editingUser.amount,
          },
        }),
      });
      if (res.ok) {
        showBanner(`User ${editingUser.registration_id} updated successfully!`);
        setEditingUser(null);
        loadAllData();
      }
    } catch (e) {
      showBanner('Failed to update user', 'error');
    }
  };

  const handleInquiryStatusChange = async (id: number, status: 'new' | 'contacted' | 'resolved') => {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showBanner(`Inquiry #${id} marked as ${status}`);
        loadAllData();
      }
    } catch (e) {
      showBanner('Failed to update inquiry status', 'error');
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showBanner(`Inquiry #${id} deleted`);
        loadAllData();
      }
    } catch (e) {
      showBanner('Failed to delete inquiry', 'error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold text-slate-300">Checking secure administrator session...</span>
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

  const isRazorpayConfigured = Boolean(
    settings?.razorpay_key_id &&
    settings?.razorpay_key_secret &&
    settings?.razorpay_key_id !== 'rzp_test_placeholder'
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Top Admin Header */}
      <header className="bg-[#0A192F] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GarviLogo variant="light" size="sm" />
            <div className="hidden sm:block border-l border-white/10 pl-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Administrator Control Center</span>
              <span className="text-[10px] text-slate-400">Garvi Education Management</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Live Gateway Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300">Gateway:</span>
              {isRazorpayConfigured ? (
                <span className={`inline-flex items-center gap-1 font-bold ${settings?.razorpay_env === 'production' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${settings?.razorpay_env === 'production' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  Razorpay ({settings?.razorpay_env === 'production' ? 'LIVE' : 'TEST'})
                </span>
              ) : (
                <span className="text-cyan-300 font-medium">Sandbox Simulator</span>
              )}
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 px-3 py-2 rounded-lg border border-red-800/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
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
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'registrations'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Registrations ({totalRegs})</span>
          </button>

          <button
            onClick={() => setActiveTab('razorpay')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'razorpay'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Razorpay Gateway</span>
            {isRazorpayConfigured ? (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${settings?.razorpay_env === 'production' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {settings?.razorpay_env === 'production' ? 'LIVE' : 'TEST'}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website & Workshop Content</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
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
        
        {/* Banner Alert Toast */}
        {bannerMessage && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-md animate-fade-in ${
              bannerMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {bannerMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span>{bannerMessage.text}</span>
            </div>
            <button
              onClick={() => setBannerMessage(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                  <div className="text-2xl font-black text-[#0A192F] mt-1">₹{summary.totalRevenue}</div>
                  <span className="text-[11px] text-emerald-600 font-medium">Verified Paid Registrations</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Attendees</span>
                  <div className="text-2xl font-black text-blue-700 mt-1">{summary.verifiedRegistrations}</div>
                  <span className="text-[11px] text-slate-500 font-medium">Of {settings?.max_seats || 75} Max Seats</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Form Submissions</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{summary.totalLeads}</div>
                  <span className="text-[11px] text-amber-600 font-medium">{summary.paymentPending} Pending Checkout</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Layers className="w-6 h-6 stroke-[2]" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
                  <div className="text-2xl font-black text-purple-700 mt-1">{summary.conversionRate}</div>
                  <span className="text-[11px] text-slate-500 font-medium">{summary.totalVisitors} Estimated Visitors</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 stroke-[2]" />
                </div>
              </div>

            </div>

            {/* Quick Action Strip */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Quick Actions:</span>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-[#0A192F] hover:bg-[#152544] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Participant Manually</span>
                </button>
                <button
                  onClick={() => setActiveTab('razorpay')}
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-blue-200 transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Configure Razorpay Keys</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* UTM Campaign Attribution Performance */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Meta Ads & UTM Campaign Attribution</h3>
                  <p className="text-xs text-slate-500">Live breakdown of registrations and revenue attributed to Meta Ad sets and UTM sources.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Campaign Name</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4 text-center">Leads Initiated</th>
                      <th className="py-3 px-4 text-center">Paid Conversions</th>
                      <th className="py-3 px-4 text-right">Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics?.campaigns?.length > 0 ? (
                      analytics.campaigns.map((camp: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-semibold text-slate-900">{camp.utm_campaign}</td>
                          <td className="py-3 px-4 text-slate-600">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium text-xs">
                              {camp.utm_source}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-700">{camp.leads}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">{camp.conversions}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">₹{camp.revenue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No UTM campaign data recorded yet. Meta Ads traffic with tags like <code>?utm_source=meta&amp;utm_campaign=workshop</code> will automatically appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Automation trigger test */}
            <div className="bg-gradient-to-r from-blue-900 to-[#0A192F] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-300" />
                  <span>Workshop Reminder Automation</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Automated notifications sent via WhatsApp &amp; Email to all confirmed registrants for {settings?.workshop_date || 'upcoming session'}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    fetch('/api/cron/reminders?type=1_day_before')
                      .then((r) => r.json())
                      .then((d) => showBanner(`1-Day Reminders processed for ${d.processed} attendees.`));
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  Trigger 1-Day Reminder
                </button>
                <button
                  onClick={() => {
                    fetch('/api/cron/reminders?type=1_hour_before')
                      .then((r) => r.json())
                      .then((d) => showBanner(`1-Hour Reminders processed for ${d.processed} attendees.`));
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Trigger 1-Hour Reminder
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: USERS & REGISTRATIONS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            
            {/* Header + Actions */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">User Registrations &amp; Funnel Leads</h3>
                <p className="text-xs text-slate-500">View, search, edit, and manage all attendees who filled out the registration form.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-[#0A192F] hover:bg-[#152544] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User Manually</span>
                </button>

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

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, school, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0A192F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700"
                >
                  <option value="">All Statuses ({totalRegs})</option>
                  <option value="registration_confirmed">Confirmed Paid</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Registrations Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Reg ID</th>
                    <th className="py-3 px-3">Participant</th>
                    <th className="py-3 px-3">School &amp; City</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Fee</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr key={reg.id || reg.registration_id} className="hover:bg-slate-50/80 transition-colors">
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
                          <select
                            value={reg.status}
                            onChange={(e) => handleQuickStatusChange(reg.registration_id, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                              reg.status === 'registration_confirmed' || reg.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : reg.status === 'payment_failed'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : reg.status === 'refunded'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="registration_confirmed">✓ Confirmed</option>
                            <option value="pending_payment">⏳ Pending</option>
                            <option value="payment_failed">✗ Failed</option>
                            <option value="refunded">↺ Refunded</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ₹{reg.amount}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              title="View Full Details"
                              onClick={() => setViewingUser(reg)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Edit User"
                              onClick={() => setEditingUser(reg)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Resend WhatsApp"
                              onClick={() => handleResendNotification(reg.registration_id, 'whatsapp')}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Delete User"
                              onClick={() => handleDeleteUser(reg.registration_id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        No registrations found. Forms submitted on the landing page will automatically appear here!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RAZORPAY PAYMENT GATEWAY SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'razorpay' && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-lg">Razorpay Payment Gateway Integration</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage Razorpay credentials, toggle between Test and Live environments, and save keys directly without touching environment files.
                </p>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-auto">
                {isRazorpayConfigured ? (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    settings.razorpay_env === 'production'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${settings.razorpay_env === 'production' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                    <span>{settings.razorpay_env === 'production' ? 'Production Mode Active' : 'Test Mode Active'}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Sandbox Simulator (Keys not yet entered)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Environment Selector Radio */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Payment Environment
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Choose <strong>Test Mode</strong> to test with Razorpay test cards, or <strong>Production Mode</strong> to accept real customer payments of ₹{settings.price || 199}.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    settings.razorpay_env !== 'production'
                      ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="razorpay_env"
                    value="test"
                    checked={settings.razorpay_env !== 'production'}
                    onChange={() => setSettings({ ...settings, razorpay_env: 'test' })}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Test / Development Mode</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Uses <code>rzp_test_...</code> keys. No real money is charged. Allows testing the entire funnel and webhooks.
                    </div>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    settings.razorpay_env === 'production'
                      ? 'bg-emerald-50/60 border-emerald-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="razorpay_env"
                    value="production"
                    checked={settings.razorpay_env === 'production'}
                    onChange={() => setSettings({ ...settings, razorpay_env: 'production' })}
                    className="mt-1 text-emerald-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Production / Live Mode</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Uses <code>rzp_live_...</code> keys. Charges real payment via UPI, Debit/Credit Card, and Netbanking.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* API Keys Configuration */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Enter Razorpay API Credentials
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razorpay Key ID *
                </label>
                <input
                  type="text"
                  placeholder={settings.razorpay_env === 'production' ? 'rzp_live_xxxxxxxxxxxxxxxx' : 'rzp_test_xxxxxxxxxxxxxxxx'}
                  value={settings.razorpay_key_id || ''}
                  onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Found in Razorpay Dashboard &gt; Settings &gt; API Keys.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razorpay Key Secret *
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder="Enter your Razorpay Key Secret..."
                    value={settings.razorpay_key_secret || ''}
                    onChange={(e) => setSettings({ ...settings, razorpay_key_secret: e.target.value.trim() })}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Used securely on the server to cryptographically verify HMAC SHA256 payment signatures.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razorpay Webhook Secret (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Secret configured in your Razorpay Webhook settings"
                  value={settings.razorpay_webhook_secret || ''}
                  onChange={(e) => setSettings({ ...settings, razorpay_webhook_secret: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Webhook URL to add in Razorpay Dashboard: <code>https://yourdomain.com/api/payment/webhook</code>
                </span>
              </div>
            </div>

            {/* Helper Callout */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">How the Payment Flow Works:</strong>
                <p className="mt-1 text-blue-800 leading-relaxed">
                  When you save your Key ID and Secret, any visitor clicking &quot;Register Now&quot; on the website will be shown the official Razorpay Checkout popup with UPI, Google Pay, PhonePe, Paytm, Cards, and Netbanking. Once payment completes, Razorpay securely notifies the backend, registers the attendee as <strong>Confirmed Paid</strong>, and dispatches their WhatsApp and Email confirmation.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Razorpay Configuration</span>
              </button>
            </div>

          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WEBSITE CONTENT & WORKSHOP SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                Website Content &amp; Workshop Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage all information displayed across the landing page, announcement bars, pricing, and contact cards in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Title
                </label>
                <input
                  type="text"
                  value={settings.workshop_title || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Date (Displayed on Website)
                </label>
                <input
                  type="text"
                  value={settings.workshop_date || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop Time (Displayed on Website)
                </label>
                <input
                  type="text"
                  value={settings.workshop_time || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_time: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Max Seats / Attendees Limit
                </label>
                <input
                  type="number"
                  value={settings.max_seats || 75}
                  onChange={(e) => setSettings({ ...settings, max_seats: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp Group Joining Link (Sent to Confirmed Registrants)
                </label>
                <input
                  type="url"
                  value={settings.whatsapp_group_link || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_group_link: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preview Video Embed URL (YouTube embed link)
                </label>
                <input
                  type="url"
                  value={settings.preview_video_url || ''}
                  onChange={(e) => setSettings({ ...settings, preview_video_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Support Phone / WhatsApp Helpline
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Office Physical Address
                </label>
                <input
                  type="text"
                  value={settings.contact_address || ''}
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Meta (Facebook) Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789012345"
                  value={settings.meta_pixel_id || ''}
                  onChange={(e) => setSettings({ ...settings, meta_pixel_id: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#152544] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Website Content</span>
              </button>
            </div>

          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT INQUIRIES */}
        {/* ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Direct Contact Inquiries</h3>
                <p className="text-xs text-slate-500">Messages and question submissions submitted via the website contact page.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Sender Name</th>
                    <th className="py-3 px-3">School</th>
                    <th className="py-3 px-3">Phone &amp; Email</th>
                    <th className="py-3 px-3">Message</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {inq.name}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {inq.school}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-xs text-slate-900">{inq.mobile}</div>
                          <div className="text-[11px] text-slate-500">{inq.email}</div>
                        </td>
                        <td className="py-3 px-3 max-w-xs text-slate-600 text-xs truncate">
                          {inq.message}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <select
                            value={inq.status}
                            onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as any)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                              inq.status === 'resolved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : inq.status === 'contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="new">● New</option>
                            <option value="contacted">📞 Contacted</option>
                            <option value="resolved">✓ Resolved</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/91${inq.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20contacting%20Garvi%20Education.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${inq.mobile}`}
                              title="Call"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        No contact inquiries received yet. Inquiries submitted via the Contact page will be listed here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: NOTIFICATION LOGS */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">AiSensy WhatsApp &amp; Email Notification Logs</h3>
              <p className="text-xs text-slate-500">Audit trail of automated messages, confirmations, and reminders dispatched to participants.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Reg ID</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Template / Campaign</th>
                    <th className="py-2.5 px-3">Recipient</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics?.recentNotifications?.length > 0 ? (
                    analytics.recentNotifications.map((notif: any) => (
                      <tr key={notif.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                          {new Date(notif.sent_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                          {notif.registration_id}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            notif.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {notif.channel.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {notif.template_name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-800">
                          {notif.recipient}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <Check className="w-3 h-3" /> Sent
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No notification dispatches recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW USER FULL DETAILS */}
      {/* ========================================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Registration Dossier
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{viewingUser.full_name}</h3>
                <span className="font-mono text-xs text-blue-700 font-bold">{viewingUser.registration_id}</span>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Contact Phone</span>
                <div className="font-mono font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>{viewingUser.mobile}</span>
                  <a
                    href={`https://wa.me/91${viewingUser.mobile.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline text-[11px]"
                  >
                    WhatsApp &rarr;
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email Address</span>
                <div className="font-mono font-bold text-slate-900 text-sm truncate">
                  {viewingUser.email}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">School / Institution</span>
                <div className="font-bold text-slate-900 text-sm">
                  {viewingUser.school_name}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">City / District</span>
                <div className="font-bold text-slate-900 text-sm">
                  {viewingUser.city}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Designation / Role</span>
                <div className="font-bold text-slate-900 text-sm">
                  {viewingUser.role}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Payment Status</span>
                <div className="font-bold text-sm">
                  {viewingUser.status === 'registration_confirmed' || viewingUser.status === 'paid' ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Confirmed Paid (₹{viewingUser.amount})
                    </span>
                  ) : (
                    <span className="text-amber-600">Pending Payment (₹{viewingUser.amount})</span>
                  )}
                </div>
              </div>

              {viewingUser.razorpay_order_id && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Razorpay Order ID</span>
                  <div className="font-mono text-xs text-slate-700">{viewingUser.razorpay_order_id}</div>
                </div>
              )}

              {viewingUser.razorpay_payment_id && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Razorpay Payment ID</span>
                  <div className="font-mono text-xs text-slate-700">{viewingUser.razorpay_payment_id}</div>
                </div>
              )}

              {viewingUser.utm_source && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Marketing Attribution</span>
                  <div className="text-xs text-slate-700">
                    Source: <strong className="font-mono">{viewingUser.utm_source}</strong> | Campaign: <strong className="font-mono">{viewingUser.utm_campaign || 'N/A'}</strong>
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href={`/thank-you?regId=${viewingUser.registration_id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Thank You Receipt</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingUser(viewingUser);
                    setViewingUser(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Edit User
                </button>
                <button
                  onClick={() => setViewingUser(null)}
                  className="bg-[#0A192F] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD USER MANUALLY */}
      {/* ========================================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleAddUserSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register Participant Manually</h3>
                <p className="text-xs text-slate-500">Direct registration for telephone or offline bookings.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9425100000"
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@school.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">School / Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rewa Public School"
                    value={newUser.schoolName}
                    onChange={(e) => setNewUser({ ...newUser, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={newUser.city}
                    onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="registration_confirmed">Confirmed Paid (₹199)</option>
                    <option value="pending_payment">Pending Payment</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Create Registration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT USER DETAILS */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleEditUserSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit User Details</h3>
                <span className="font-mono text-xs text-blue-700 font-bold">{editingUser.registration_id}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={editingUser.mobile}
                    onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={editingUser.school_name}
                    onChange={(e) => setEditingUser({ ...editingUser, school_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingUser.city}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white font-bold"
                  >
                    <option value="registration_confirmed">registration_confirmed</option>
                    <option value="pending_payment">pending_payment</option>
                    <option value="payment_failed">payment_failed</option>
                    <option value="refunded">refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editingUser.amount}
                    onChange={(e) => setEditingUser({ ...editingUser, amount: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
