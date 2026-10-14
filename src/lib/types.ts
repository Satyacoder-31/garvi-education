export type RegistrationStatus =
  | 'pending_payment'
  | 'payment_processing'
  | 'paid'
  | 'registration_confirmed'
  | 'payment_failed'
  | 'refund_pending'
  | 'refunded';

export interface Registration {
  id: number;
  registration_id: string; // e.g. GARVI-2026-AB123
  full_name: string;
  mobile: string;
  email: string;
  school_name: string;
  city: string;
  role: string;
  amount: number; // in INR, e.g. 199
  currency: string;
  status: RegistrationStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkshopSettings {
  id: number;
  workshop_title: string;
  workshop_date: string; // e.g. "Saturday, 25 October 2026"
  workshop_time: string; // e.g. "6:00 PM IST"
  duration: string; // e.g. "2 Hours"
  price: number; // 199
  max_seats: number; // 75
  whatsapp_group_link: string;
  preview_video_url: string;
  instructor_name: string;
  instructor_role: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  meta_pixel_id: string;
}

export interface NotificationLog {
  id: number;
  registration_id: string;
  channel: 'email' | 'whatsapp';
  template_name: string;
  recipient: string;
  status: 'sent' | 'pending' | 'failed';
  error_message?: string;
  sent_at: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  leadsSubmitted: number;
  checkoutsInitiated: number;
  verifiedRegistrations: number;
  conversionRate: number;
  totalRevenue: number;
  campaigns: Array<{
    utm_campaign: string;
    utm_source: string;
    leads: number;
    conversions: number;
    revenue: number;
  }>;
}

export interface AnalyticsEvent {
  id: number;
  event_name: string;
  event_id?: string;
  registration_id?: string;
  utm_source?: string;
  utm_campaign?: string;
  created_at: string;
}
