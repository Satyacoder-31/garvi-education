import { Pool } from 'pg';
import { Registration, WorkshopSettings, NotificationLog, AnalyticsEvent, ContactMessage } from './types';

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
  // Razorpay Dynamic Configuration
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

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.zhkexnxgvtlvmogksfej:DrOrthosSecure2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

let pool: Pool | null = null;
let cachedSettings: WorkshopSettings | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client pool:', err);
    });
  }
  return pool;
}

function mapRegistrationRow(row: any): Registration {
  return {
    id: row.id,
    registration_id: row.registration_id,
    full_name: row.full_name,
    mobile: row.mobile,
    email: row.email,
    school_name: row.school_name,
    city: row.city,
    role: row.role,
    amount: Number(row.amount),
    currency: row.currency || 'INR',
    status: row.status,
    razorpay_order_id: row.razorpay_order_id || undefined,
    razorpay_payment_id: row.razorpay_payment_id || undefined,
    razorpay_signature: row.razorpay_signature || undefined,
    utm_source: row.utm_source || undefined,
    utm_medium: row.utm_medium || undefined,
    utm_campaign: row.utm_campaign || undefined,
    utm_content: row.utm_content || undefined,
    utm_term: row.utm_term || undefined,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

function mapSettingsRow(row: any): WorkshopSettings {
  return {
    id: 1,
    workshop_title: row.workshop_title || defaultSettings.workshop_title,
    workshop_date: row.workshop_date || defaultSettings.workshop_date,
    workshop_time: row.workshop_time || defaultSettings.workshop_time,
    duration: row.duration || defaultSettings.duration,
    price: Number(row.price) || defaultSettings.price,
    max_seats: Number(row.max_seats) || defaultSettings.max_seats,
    whatsapp_group_link: row.whatsapp_group_link || defaultSettings.whatsapp_group_link,
    preview_video_url: row.preview_video_url || defaultSettings.preview_video_url,
    instructor_name: row.instructor_name || defaultSettings.instructor_name,
    instructor_role: row.instructor_role || defaultSettings.instructor_role,
    contact_email: row.contact_email || defaultSettings.contact_email,
    contact_phone: row.contact_phone || defaultSettings.contact_phone,
    contact_address: row.contact_address || defaultSettings.contact_address,
    meta_pixel_id: row.meta_pixel_id || '',
    razorpay_env: row.razorpay_env || 'test',
    razorpay_key_id: row.razorpay_key_id || '',
    razorpay_key_secret: row.razorpay_key_secret || '',
    razorpay_webhook_secret: row.razorpay_webhook_secret || '',
    hero_headline: row.hero_headline || defaultSettings.hero_headline,
    hero_subheadline: row.hero_subheadline || defaultSettings.hero_subheadline,
    hero_badge: row.hero_badge || defaultSettings.hero_badge,
    announcement_text: row.announcement_text || defaultSettings.announcement_text,
    whatsapp_support_number: row.whatsapp_support_number || defaultSettings.whatsapp_support_number,
  };
}

// ---------------- Workshop Settings Operations ----------------

export async function getWorkshopSettings(): Promise<WorkshopSettings> {
  try {
    const clientPool = getPool();
    const res = await clientPool.query('SELECT * FROM garvi_settings WHERE id = 1 LIMIT 1');
    if (res.rows.length > 0) {
      cachedSettings = mapSettingsRow(res.rows[0]);
      return cachedSettings;
    }
  } catch (err) {
    console.error('Failed to query garvi_settings from DB:', err);
  }
  return cachedSettings || defaultSettings;
}

export function getCachedWorkshopSettings(): WorkshopSettings {
  return cachedSettings || defaultSettings;
}

export async function updateWorkshopSettings(settings: Partial<WorkshopSettings>): Promise<WorkshopSettings> {
  const clientPool = getPool();
  const current = await getWorkshopSettings();
  const merged = { ...current, ...settings, id: 1 };

  const query = `
    INSERT INTO garvi_settings (
      id, workshop_title, workshop_date, workshop_time, duration, price, max_seats,
      whatsapp_group_link, preview_video_url, instructor_name, instructor_role,
      contact_email, contact_phone, contact_address, meta_pixel_id,
      razorpay_env, razorpay_key_id, razorpay_key_secret, razorpay_webhook_secret,
      hero_headline, hero_subheadline, hero_badge, announcement_text, whatsapp_support_number
    ) VALUES (
      1, $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18,
      $19, $20, $21, $22, $23
    )
    ON CONFLICT (id) DO UPDATE SET
      workshop_title = EXCLUDED.workshop_title,
      workshop_date = EXCLUDED.workshop_date,
      workshop_time = EXCLUDED.workshop_time,
      duration = EXCLUDED.duration,
      price = EXCLUDED.price,
      max_seats = EXCLUDED.max_seats,
      whatsapp_group_link = EXCLUDED.whatsapp_group_link,
      preview_video_url = EXCLUDED.preview_video_url,
      instructor_name = EXCLUDED.instructor_name,
      instructor_role = EXCLUDED.instructor_role,
      contact_email = EXCLUDED.contact_email,
      contact_phone = EXCLUDED.contact_phone,
      contact_address = EXCLUDED.contact_address,
      meta_pixel_id = EXCLUDED.meta_pixel_id,
      razorpay_env = EXCLUDED.razorpay_env,
      razorpay_key_id = EXCLUDED.razorpay_key_id,
      razorpay_key_secret = EXCLUDED.razorpay_key_secret,
      razorpay_webhook_secret = EXCLUDED.razorpay_webhook_secret,
      hero_headline = EXCLUDED.hero_headline,
      hero_subheadline = EXCLUDED.hero_subheadline,
      hero_badge = EXCLUDED.hero_badge,
      announcement_text = EXCLUDED.announcement_text,
      whatsapp_support_number = EXCLUDED.whatsapp_support_number
    RETURNING *;
  `;

  const values = [
    merged.workshop_title,
    merged.workshop_date,
    merged.workshop_time,
    merged.duration,
    merged.price,
    merged.max_seats,
    merged.whatsapp_group_link,
    merged.preview_video_url,
    merged.instructor_name,
    merged.instructor_role,
    merged.contact_email,
    merged.contact_phone,
    merged.contact_address,
    merged.meta_pixel_id || '',
    merged.razorpay_env || 'test',
    merged.razorpay_key_id || '',
    merged.razorpay_key_secret || '',
    merged.razorpay_webhook_secret || '',
    merged.hero_headline || defaultSettings.hero_headline,
    merged.hero_subheadline || defaultSettings.hero_subheadline,
    merged.hero_badge || defaultSettings.hero_badge,
    merged.announcement_text || defaultSettings.announcement_text,
    merged.whatsapp_support_number || defaultSettings.whatsapp_support_number,
  ];

  const res = await clientPool.query(query, values);
  cachedSettings = mapSettingsRow(res.rows[0]);
  return cachedSettings;
}

// ---------------- Registrations Operations ----------------

export async function createRegistration(data: {
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
}): Promise<Registration> {
  const clientPool = getPool();
  const now = new Date().toISOString();
  const query = `
    INSERT INTO garvi_registrations (
      registration_id, full_name, mobile, email, school_name, city, role,
      amount, currency, status, razorpay_order_id,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13, $14, $15, $16,
      $17, $18
    )
    ON CONFLICT (registration_id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      mobile = EXCLUDED.mobile,
      email = EXCLUDED.email,
      school_name = EXCLUDED.school_name,
      city = EXCLUDED.city,
      role = EXCLUDED.role,
      amount = EXCLUDED.amount,
      razorpay_order_id = EXCLUDED.razorpay_order_id,
      updated_at = EXCLUDED.updated_at
    RETURNING *;
  `;
  const values = [
    data.registration_id,
    data.full_name,
    data.mobile,
    data.email,
    data.school_name,
    data.city,
    data.role,
    data.amount,
    'INR',
    'pending_payment',
    data.razorpay_order_id || null,
    data.utm_source || null,
    data.utm_medium || null,
    data.utm_campaign || null,
    data.utm_content || null,
    data.utm_term || null,
    now,
    now,
  ];
  const res = await clientPool.query(query, values);
  return mapRegistrationRow(res.rows[0]);
}

export async function getRegistrationById(registrationId: string): Promise<Registration | null> {
  const clientPool = getPool();
  const res = await clientPool.query(
    'SELECT * FROM garvi_registrations WHERE registration_id = $1 LIMIT 1',
    [registrationId]
  );
  if (res.rows.length === 0) return null;
  return mapRegistrationRow(res.rows[0]);
}

export async function getRegistrationByOrderId(orderId: string): Promise<Registration | null> {
  const clientPool = getPool();
  const res = await clientPool.query(
    'SELECT * FROM garvi_registrations WHERE razorpay_order_id = $1 LIMIT 1',
    [orderId]
  );
  if (res.rows.length === 0) return null;
  return mapRegistrationRow(res.rows[0]);
}

export async function updateRegistrationPaymentSuccess(
  registrationId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<Registration> {
  const clientPool = getPool();
  const now = new Date().toISOString();
  const res = await clientPool.query(
    `UPDATE garvi_registrations
     SET status = 'registration_confirmed',
         razorpay_payment_id = $1,
         razorpay_signature = $2,
         updated_at = $3
     WHERE registration_id = $4
     RETURNING *`,
    [razorpayPaymentId, razorpaySignature, now, registrationId]
  );
  if (res.rows.length === 0) {
    throw new Error(`Registration not found: ${registrationId}`);
  }
  return mapRegistrationRow(res.rows[0]);
}

export async function updateRegistrationStatus(registrationId: string, status: string): Promise<void> {
  const clientPool = getPool();
  const now = new Date().toISOString();
  await clientPool.query(
    `UPDATE garvi_registrations SET status = $1, updated_at = $2 WHERE registration_id = $3`,
    [status, now, registrationId]
  );
}

export async function updateRegistration(
  registrationId: string,
  updates: Partial<Registration>
): Promise<Registration | null> {
  const clientPool = getPool();
  const allowedFields = [
    'full_name',
    'mobile',
    'email',
    'school_name',
    'city',
    'role',
    'amount',
    'status',
    'razorpay_order_id',
    'razorpay_payment_id',
    'utm_source',
    'utm_campaign',
  ];
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  for (const [key, val] of Object.entries(updates)) {
    if (allowedFields.includes(key) && val !== undefined) {
      setClauses.push(`${key} = $${paramIdx++}`);
      values.push(val);
    }
  }

  if (setClauses.length === 0) {
    return getRegistrationById(registrationId);
  }

  setClauses.push(`updated_at = $${paramIdx++}`);
  values.push(new Date().toISOString());

  values.push(registrationId);
  const query = `UPDATE garvi_registrations SET ${setClauses.join(', ')} WHERE registration_id = $${paramIdx} RETURNING *`;

  const res = await clientPool.query(query, values);
  if (res.rows.length === 0) return null;
  return mapRegistrationRow(res.rows[0]);
}

export async function deleteRegistration(registrationId: string): Promise<boolean> {
  const clientPool = getPool();
  const res = await clientPool.query(
    'DELETE FROM garvi_registrations WHERE registration_id = $1',
    [registrationId]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function getAdminRegistrations(options: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
  isExport?: boolean;
}): Promise<{ registrations: Registration[]; total: number }> {
  const clientPool = getPool();
  const { search = '', status = '', limit = 50, offset = 0, isExport = false } = options;

  const whereClauses: string[] = ['1=1'];
  const params: any[] = [];
  let paramIdx = 1;

  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`;
    whereClauses.push(`(
      registration_id ILIKE $${paramIdx} OR
      full_name ILIKE $${paramIdx} OR
      email ILIKE $${paramIdx} OR
      mobile ILIKE $${paramIdx} OR
      school_name ILIKE $${paramIdx} OR
      city ILIKE $${paramIdx}
    )`);
    params.push(pattern);
    paramIdx++;
  }

  if (status && status.trim()) {
    whereClauses.push(`status = $${paramIdx}`);
    params.push(status.trim());
    paramIdx++;
  }

  const whereSql = whereClauses.join(' AND ');

  // Get total count
  const countRes = await clientPool.query(
    `SELECT COUNT(*) as total FROM garvi_registrations WHERE ${whereSql}`,
    params
  );
  const total = parseInt(countRes.rows[0]?.total || '0', 10);

  // Get rows
  let selectSql = `SELECT * FROM garvi_registrations WHERE ${whereSql} ORDER BY id DESC`;
  const queryParams = [...params];

  if (!isExport) {
    selectSql += ` LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    queryParams.push(limit, offset);
  }

  const rowsRes = await clientPool.query(selectSql, queryParams);
  const registrations = rowsRes.rows.map(mapRegistrationRow);

  return { registrations, total };
}

export async function getConfirmedRegistrations(): Promise<Registration[]> {
  const clientPool = getPool();
  const res = await clientPool.query(
    "SELECT * FROM garvi_registrations WHERE status IN ('registration_confirmed', 'paid') ORDER BY id DESC"
  );
  return res.rows.map(mapRegistrationRow);
}

// ---------------- Admin Analytics ----------------

export async function getAdminAnalytics() {
  const clientPool = getPool();

  const [leadsRes, paidRes, pendingRes, failedRes, viewsRes, campaignsRes, notificationsRes] = await Promise.all([
    clientPool.query('SELECT COUNT(*) as count FROM garvi_registrations'),
    clientPool.query("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as revenue FROM garvi_registrations WHERE status IN ('registration_confirmed', 'paid')"),
    clientPool.query("SELECT COUNT(*) as count FROM garvi_registrations WHERE status = 'pending_payment'"),
    clientPool.query("SELECT COUNT(*) as count FROM garvi_registrations WHERE status = 'payment_failed'"),
    clientPool.query("SELECT COUNT(*) as count FROM garvi_analytics_events WHERE event_name = 'page_view'"),
    clientPool.query(`
      SELECT
        COALESCE(utm_campaign, 'Direct / Organic') as utm_campaign,
        COALESCE(utm_source, 'None') as utm_source,
        COUNT(*) as leads,
        SUM(CASE WHEN status IN ('registration_confirmed', 'paid') THEN 1 ELSE 0 END) as conversions,
        SUM(CASE WHEN status IN ('registration_confirmed', 'paid') THEN amount ELSE 0 END) as revenue
      FROM garvi_registrations
      GROUP BY utm_campaign, utm_source
      ORDER BY conversions DESC, leads DESC
      LIMIT 10
    `),
    clientPool.query('SELECT * FROM garvi_notifications_log ORDER BY id DESC LIMIT 10')
  ]);

  const totalLeads = parseInt(leadsRes.rows[0]?.count || '0', 10);
  const verifiedCount = parseInt(paidRes.rows[0]?.count || '0', 10);
  const totalRevenue = parseInt(paidRes.rows[0]?.revenue || '0', 10);
  const paymentPending = parseInt(pendingRes.rows[0]?.count || '0', 10);
  const paymentFailed = parseInt(failedRes.rows[0]?.count || '0', 10);
  const pageViews = parseInt(viewsRes.rows[0]?.count || '0', 10);

  const totalVisitors = Math.max(pageViews, totalLeads > 0 ? totalLeads * 3 : 1);
  const conversionRate = totalLeads > 0 ? ((verifiedCount / totalLeads) * 100).toFixed(1) : '0.0';

  return {
    summary: {
      totalVisitors,
      totalLeads,
      paymentPending,
      paymentFailed,
      verifiedRegistrations: verifiedCount,
      totalRevenue,
      conversionRate: `${conversionRate}%`,
    },
    campaigns: campaignsRes.rows.map((r) => ({
      utm_campaign: r.utm_campaign,
      utm_source: r.utm_source,
      leads: parseInt(r.leads || '0', 10),
      conversions: parseInt(r.conversions || '0', 10),
      revenue: parseInt(r.revenue || '0', 10),
    })),
    recentNotifications: notificationsRes.rows.map((r) => ({
      id: r.id,
      registration_id: r.registration_id,
      channel: r.channel,
      template_name: r.template_name,
      recipient: r.recipient,
      status: r.status,
      error_message: r.error_message,
      sent_at: r.sent_at ? new Date(r.sent_at).toISOString() : new Date().toISOString(),
    })),
  };
}

// ---------------- Contact Messages Operations ----------------

export async function createContactMessage(data: {
  name: string;
  mobile: string;
  email: string;
  school: string;
  message: string;
}): Promise<ContactMessage> {
  const clientPool = getPool();
  const res = await clientPool.query(
    `INSERT INTO garvi_contact_messages (name, mobile, email, school, message, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'new', CURRENT_TIMESTAMP)
     RETURNING *`,
    [data.name, data.mobile, data.email, data.school, data.message]
  );
  const r = res.rows[0];
  return {
    id: r.id,
    name: r.name,
    mobile: r.mobile,
    email: r.email,
    school: r.school,
    message: r.message,
    status: r.status,
    created_at: new Date(r.created_at).toISOString(),
  };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const clientPool = getPool();
  const res = await clientPool.query('SELECT * FROM garvi_contact_messages ORDER BY id DESC');
  return res.rows.map((r) => ({
    id: r.id,
    name: r.name,
    mobile: r.mobile,
    email: r.email,
    school: r.school,
    message: r.message,
    status: r.status,
    created_at: new Date(r.created_at).toISOString(),
  }));
}

export async function updateContactMessageStatus(id: number, status: 'new' | 'contacted' | 'resolved'): Promise<boolean> {
  const clientPool = getPool();
  const res = await clientPool.query(
    'UPDATE garvi_contact_messages SET status = $1 WHERE id = $2',
    [status, id]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function deleteContactMessage(id: number): Promise<boolean> {
  const clientPool = getPool();
  const res = await clientPool.query('DELETE FROM garvi_contact_messages WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// ---------------- Notifications & Analytics Logging ----------------

export async function logNotification(data: {
  registration_id: string;
  channel: 'email' | 'whatsapp';
  template_name: string;
  recipient: string;
  status: 'sent' | 'pending' | 'failed';
  error_message?: string;
}): Promise<void> {
  try {
    const clientPool = getPool();
    await clientPool.query(
      `INSERT INTO garvi_notifications_log (registration_id, channel, template_name, recipient, status, error_message, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
      [data.registration_id, data.channel, data.template_name, data.recipient, data.status, data.error_message || null]
    );
  } catch (err) {
    console.error('Failed to log notification to database:', err);
  }
}

export async function getNotificationLogs(limit: number = 50): Promise<NotificationLog[]> {
  const clientPool = getPool();
  const res = await clientPool.query('SELECT * FROM garvi_notifications_log ORDER BY id DESC LIMIT $1', [limit]);
  return res.rows.map((r) => ({
    id: r.id,
    registration_id: r.registration_id,
    channel: r.channel,
    template_name: r.template_name,
    recipient: r.recipient,
    status: r.status,
    error_message: r.error_message,
    sent_at: new Date(r.sent_at).toISOString(),
  }));
}

export async function hasNotificationBeenSent(registrationId: string, templateType: string): Promise<boolean> {
  const clientPool = getPool();
  const res = await clientPool.query(
    "SELECT id FROM garvi_notifications_log WHERE registration_id = $1 AND template_name LIKE $2 AND status = 'sent' LIMIT 1",
    [registrationId, `%${templateType}%`]
  );
  return res.rows.length > 0;
}

export async function recordAnalyticsEvent(
  eventName: string,
  registrationId?: string,
  utmSource?: string,
  utmCampaign?: string
): Promise<void> {
  try {
    const clientPool = getPool();
    await clientPool.query(
      `INSERT INTO garvi_analytics_events (event_name, registration_id, utm_source, utm_campaign, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [eventName, registrationId || null, utmSource || null, utmCampaign || null]
    );
  } catch (err) {
    console.error('Failed to record analytics event to database:', err);
  }
}

// Backward compatibility layer
export const db = {
  prepare() {
    return {
      get() { return null; },
      all() { return []; },
      run() { return { changes: 1, lastInsertRowid: 1 }; },
    };
  },
  exec() { return true; },
  pragma() { return true; },
};
