import fs from 'fs';
import path from 'path';
import { Registration, WorkshopSettings, NotificationLog, AnalyticsEvent, ContactMessage } from './types';

// Determine a writable data directory (uses /tmp on Vercel/serverless environments)
function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp';
  }
  const localDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return localDir;
  } catch {
    return '/tmp';
  }
}

interface DatabaseSchema {
  registrations: Registration[];
  workshop_settings: WorkshopSettings;
  notifications_log: NotificationLog[];
  analytics_events: AnalyticsEvent[];
  contact_messages: ContactMessage[];
  counters: {
    registrationId: number;
    notificationId: number;
    analyticsId: number;
    contactId: number;
  };
}

const defaultSettings: WorkshopSettings = {
  id: 1,
  workshop_title: 'Online School Management Workshop',
  workshop_date: 'Saturday, 25 October 2026',
  workshop_time: '6:00 PM – 8:00 PM IST',
  duration: '2 Hours Interactive Live Session',
  price: 199,
  max_seats: 75,
  whatsapp_group_link: 'https://chat.whatsapp.com/GarviEducationWorkshop',
  preview_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  instructor_name: 'Senior School Operations Specialist',
  instructor_role: 'Garvi Education Academic Panel',
  contact_email: 'contact@garvieducation.com',
  contact_phone: '+91 94251 00000',
  contact_address: 'Garvi Education, Civil Lines, Rewa, Madhya Pradesh 486001',
  meta_pixel_id: '',
  // Default Razorpay Dynamic Configuration
  razorpay_env: 'test',
  razorpay_key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  // Default Homepage Copy
  hero_headline: 'Transform the Way You Manage Your School.',
  hero_subheadline: 'Join our practical online workshop to explore smarter approaches to school administration, student records, fee management, attendance, and everyday school operations.',
  hero_badge: 'GARVI EDUCATION PRESENTS | Online Workshop',
  announcement_text: 'Online School Management Workshop • Saturday, 25 October 2026 • 6:00 PM IST',
  whatsapp_support_number: '9425100000',
};

const initialData: DatabaseSchema = {
  registrations: [],
  workshop_settings: defaultSettings,
  notifications_log: [],
  analytics_events: [],
  contact_messages: [],
  counters: {
    registrationId: 1,
    notificationId: 1,
    analyticsId: 1,
    contactId: 1,
  },
};

let memoryStore: DatabaseSchema | null = null;

function getStoreFilePath(): string {
  return path.join(getDataDir(), 'garvi_data.json');
}

function loadStore(): DatabaseSchema {
  if (memoryStore) return memoryStore;

  const filePath = getStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      memoryStore = JSON.parse(content);
      if (!memoryStore?.workshop_settings) {
        memoryStore!.workshop_settings = defaultSettings;
      } else {
        // Merge missing keys with defaults
        memoryStore!.workshop_settings = { ...defaultSettings, ...memoryStore!.workshop_settings };
      }
      if (!memoryStore?.contact_messages) {
        memoryStore!.contact_messages = [];
      }
      if (!memoryStore?.counters?.contactId) {
        memoryStore!.counters = { ...initialData.counters, ...(memoryStore!.counters || {}) };
      }
      return memoryStore!;
    }
  } catch (err) {
    console.error('Failed to read database file, initializing default store:', err);
  }

  memoryStore = JSON.parse(JSON.stringify(initialData));
  saveStore();
  return memoryStore!;
}

function saveStore(): void {
  if (!memoryStore) return;
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Database save warning (using memory storage):', err);
  }
}

// Database Helper methods
export function getWorkshopSettings(): WorkshopSettings {
  const store = loadStore();
  return store.workshop_settings || defaultSettings;
}

export function updateWorkshopSettings(settings: Partial<WorkshopSettings>): WorkshopSettings {
  const store = loadStore();
  store.workshop_settings = {
    ...store.workshop_settings,
    ...settings,
    id: 1,
  };
  saveStore();
  return store.workshop_settings;
}

export function createRegistration(data: {
  registration_id: string;
  full_name: string;
  mobile: string;
  email: string;
  school_name: string;
  city: string;
  role: string;
  amount: number;
  razorpay_order_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}): Registration {
  const store = loadStore();
  const id = store.counters.registrationId++;
  const now = new Date().toISOString();

  const newReg: Registration = {
    id,
    registration_id: data.registration_id,
    full_name: data.full_name,
    mobile: data.mobile,
    email: data.email,
    school_name: data.school_name,
    city: data.city,
    role: data.role,
    amount: data.amount,
    currency: 'INR',
    status: 'pending_payment',
    razorpay_order_id: data.razorpay_order_id,
    razorpay_payment_id: undefined,
    razorpay_signature: undefined,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_content: data.utm_content,
    utm_term: data.utm_term,
    created_at: now,
    updated_at: now,
  };

  store.registrations.unshift(newReg);
  saveStore();
  return newReg;
}

export function getRegistrationById(registrationId: string): Registration | null {
  const store = loadStore();
  return store.registrations.find((r) => r.registration_id === registrationId) || null;
}

export function getRegistrationByOrderId(orderId: string): Registration | null {
  const store = loadStore();
  return store.registrations.find((r) => r.razorpay_order_id === orderId) || null;
}

export function updateRegistrationPaymentSuccess(
  registrationId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Registration {
  const store = loadStore();
  const reg = store.registrations.find((r) => r.registration_id === registrationId);
  if (reg) {
    reg.status = 'registration_confirmed';
    reg.razorpay_payment_id = razorpayPaymentId;
    reg.razorpay_signature = razorpaySignature;
    reg.updated_at = new Date().toISOString();
    saveStore();
    return reg;
  }
  throw new Error(`Registration not found: ${registrationId}`);
}

export function updateRegistrationStatus(registrationId: string, status: string): void {
  const store = loadStore();
  const reg = store.registrations.find((r) => r.registration_id === registrationId);
  if (reg) {
    reg.status = status as any;
    reg.updated_at = new Date().toISOString();
    saveStore();
  }
}

export function updateRegistration(
  registrationId: string,
  updates: Partial<Registration>
): Registration | null {
  const store = loadStore();
  const reg = store.registrations.find((r) => r.registration_id === registrationId);
  if (reg) {
    Object.assign(reg, updates, { updated_at: new Date().toISOString() });
    saveStore();
    return reg;
  }
  return null;
}

export function deleteRegistration(registrationId: string): boolean {
  const store = loadStore();
  const index = store.registrations.findIndex((r) => r.registration_id === registrationId);
  if (index !== -1) {
    store.registrations.splice(index, 1);
    saveStore();
    return true;
  }
  return false;
}

export function logNotification(data: {
  registration_id: string;
  channel: 'email' | 'whatsapp';
  template_name: string;
  recipient: string;
  status: 'sent' | 'pending' | 'failed';
  error_message?: string;
}) {
  const store = loadStore();
  const id = store.counters.notificationId++;
  const entry: NotificationLog = {
    id,
    registration_id: data.registration_id,
    channel: data.channel,
    template_name: data.template_name,
    recipient: data.recipient,
    status: data.status,
    error_message: data.error_message,
    sent_at: new Date().toISOString(),
  };
  store.notifications_log.unshift(entry);
  saveStore();
}

export function getNotificationLogs(limit: number = 50): NotificationLog[] {
  const store = loadStore();
  return store.notifications_log.slice(0, limit);
}

export function recordAnalyticsEvent(
  eventName: string,
  registrationId?: string,
  utmSource?: string,
  utmCampaign?: string
) {
  const store = loadStore();
  const id = store.counters.analyticsId++;
  const event: AnalyticsEvent = {
    id,
    event_name: eventName,
    registration_id: registrationId,
    utm_source: utmSource,
    utm_campaign: utmCampaign,
    created_at: new Date().toISOString(),
  };
  store.analytics_events.unshift(event);
  saveStore();
}

// Contact messages handlers
export function createContactMessage(data: {
  name: string;
  mobile: string;
  email: string;
  school: string;
  message: string;
}): ContactMessage {
  const store = loadStore();
  const id = store.counters.contactId++;
  const entry: ContactMessage = {
    id,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    school: data.school,
    message: data.message,
    status: 'new',
    created_at: new Date().toISOString(),
  };
  store.contact_messages.unshift(entry);
  saveStore();
  return entry;
}

export function getContactMessages(): ContactMessage[] {
  const store = loadStore();
  return store.contact_messages || [];
}

export function updateContactMessageStatus(id: number, status: 'new' | 'contacted' | 'resolved'): boolean {
  const store = loadStore();
  const msg = store.contact_messages.find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    saveStore();
    return true;
  }
  return false;
}

export function deleteContactMessage(id: number): boolean {
  const store = loadStore();
  const idx = store.contact_messages.findIndex((m) => m.id === id);
  if (idx !== -1) {
    store.contact_messages.splice(idx, 1);
    saveStore();
    return true;
  }
  return false;
}

// SQL compatibility layer for existing query-based API routes
export const db = {
  prepare(sql: string) {
    return {
      get(...params: any[]): any {
        const store = loadStore();
        const normalized = sql.trim();

        // 1. SELECT COUNT(*) as total FROM registrations
        if (normalized.includes('SELECT COUNT(*) as total FROM registrations') || (normalized.includes('COUNT(*)') && normalized.includes('registrations') && !normalized.includes('WHERE status'))) {
          let list = [...store.registrations];
          if (params.length > 0) {
            const searchParam = params[0]?.replace?.(/%/g, '').toLowerCase() || '';
            const statusParam = params[params.length - 1];
            if (searchParam) {
              list = list.filter((r) =>
                r.registration_id.toLowerCase().includes(searchParam) ||
                r.full_name.toLowerCase().includes(searchParam) ||
                r.email.toLowerCase().includes(searchParam) ||
                r.mobile.includes(searchParam) ||
                r.school_name.toLowerCase().includes(searchParam) ||
                r.city.toLowerCase().includes(searchParam)
              );
            }
            if (normalized.includes('status = ?') && statusParam && statusParam !== searchParam) {
              list = list.filter((r) => r.status === statusParam);
            }
          }
          return { total: list.length, count: list.length };
        }

        // 2. Verified Paid analytics query
        if (normalized.includes("status IN ('registration_confirmed', 'paid')")) {
          const paid = store.registrations.filter((r) => r.status === 'registration_confirmed' || r.status === 'paid');
          const revenue = paid.reduce((sum, r) => sum + (r.amount || 0), 0);
          return { count: paid.length, revenue };
        }

        // 3. Pending payment
        if (normalized.includes("status = 'pending_payment'")) {
          const pending = store.registrations.filter((r) => r.status === 'pending_payment');
          return { count: pending.length };
        }

        // 4. Payment failed
        if (normalized.includes("status = 'payment_failed'")) {
          const failed = store.registrations.filter((r) => r.status === 'payment_failed');
          return { count: failed.length };
        }

        // 5. Page views
        if (normalized.includes("analytics_events WHERE event_name = 'page_view'")) {
          const views = store.analytics_events.filter((e) => e.event_name === 'page_view');
          return { count: views.length };
        }

        // 6. Notifications sent check in reminder cron
        if (normalized.includes('FROM notifications_log') && normalized.includes('registration_id = ?')) {
          const [regId, templateLike] = params;
          const cleanLike = (templateLike || '').replace(/%/g, '').toLowerCase();
          const match = store.notifications_log.find(
            (n) => n.registration_id === regId && n.template_name.toLowerCase().includes(cleanLike) && n.status === 'sent'
          );
          return match ? { id: match.id } : null;
        }

        return null;
      },

      all(...params: any[]): any[] {
        const store = loadStore();
        const normalized = sql.trim();

        // 1. Admin Registrations table query with pagination and search
        if (normalized.includes('FROM registrations WHERE 1=1')) {
          let list = [...store.registrations];
          const searchPattern = params.find((p) => typeof p === 'string' && p.startsWith('%') && p.endsWith('%'));
          if (searchPattern) {
            const clean = searchPattern.replace(/%/g, '').toLowerCase();
            list = list.filter((r) =>
              r.registration_id.toLowerCase().includes(clean) ||
              r.full_name.toLowerCase().includes(clean) ||
              r.email.toLowerCase().includes(clean) ||
              r.mobile.includes(clean) ||
              r.school_name.toLowerCase().includes(clean) ||
              r.city.toLowerCase().includes(clean)
            );
          }
          if (normalized.includes('status = ?')) {
            const statusVal = params.find((p) => typeof p === 'string' && !p.startsWith('%'));
            if (statusVal) {
              list = list.filter((r) => r.status === statusVal);
            }
          }

          const numericParams = params.filter((p) => typeof p === 'number');
          if (numericParams.length >= 2) {
            const [limit, offset] = numericParams;
            return list.slice(offset, offset + limit);
          }
          return list;
        }

        // 2. Confirmed participants list for reminders
        if (normalized.includes("FROM registrations WHERE status IN ('registration_confirmed', 'paid')")) {
          return store.registrations.filter((r) => r.status === 'registration_confirmed' || r.status === 'paid');
        }

        // 3. UTM Campaign analytics aggregation
        if (normalized.includes('GROUP BY utm_campaign, utm_source')) {
          const groups: Record<string, { utm_campaign: string; utm_source: string; leads: number; conversions: number; revenue: number }> = {};
          for (const reg of store.registrations) {
            const campaign = reg.utm_campaign || 'Direct / Organic';
            const source = reg.utm_source || 'None';
            const key = `${campaign}__${source}`;
            if (!groups[key]) {
              groups[key] = { utm_campaign: campaign, utm_source: source, leads: 0, conversions: 0, revenue: 0 };
            }
            groups[key].leads++;
            if (reg.status === 'registration_confirmed' || reg.status === 'paid') {
              groups[key].conversions++;
              groups[key].revenue += reg.amount || 0;
            }
          }
          return Object.values(groups)
            .sort((a, b) => b.conversions - a.conversions || b.leads - a.leads)
            .slice(0, 10);
        }

        // 4. Notifications log list
        if (normalized.includes('FROM notifications_log')) {
          const limit = params.find((p) => typeof p === 'number') || 10;
          return store.notifications_log.slice(0, limit);
        }

        return [];
      },

      run(..._params: any[]) {
        return { changes: 1, lastInsertRowid: 1 };
      },
    };
  },
  exec(_sql: string) {
    return true;
  },
  pragma(_pragma: string) {
    return true;
  },
};
