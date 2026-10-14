const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.zhkexnxgvtlvmogksfej:DrOrthosSecure2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  await client.connect();
  console.log('Connected to PostgreSQL database');

  const sql = `
    CREATE TABLE IF NOT EXISTS garvi_registrations (
      id SERIAL PRIMARY KEY,
      registration_id VARCHAR(64) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      mobile VARCHAR(32) NOT NULL,
      email VARCHAR(255) NOT NULL,
      school_name VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      amount INTEGER NOT NULL DEFAULT 199,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      status VARCHAR(50) NOT NULL DEFAULT 'pending_payment',
      razorpay_order_id VARCHAR(100),
      razorpay_payment_id VARCHAR(100),
      razorpay_signature TEXT,
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      utm_content VARCHAR(100),
      utm_term VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_garvi_reg_status ON garvi_registrations(status);
    CREATE INDEX IF NOT EXISTS idx_garvi_reg_order_id ON garvi_registrations(razorpay_order_id);
    CREATE INDEX IF NOT EXISTS idx_garvi_reg_email ON garvi_registrations(email);
    CREATE INDEX IF NOT EXISTS idx_garvi_reg_mobile ON garvi_registrations(mobile);

    CREATE TABLE IF NOT EXISTS garvi_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      workshop_title VARCHAR(255) NOT NULL,
      workshop_date VARCHAR(100) NOT NULL,
      workshop_time VARCHAR(100) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      price INTEGER NOT NULL DEFAULT 199,
      max_seats INTEGER NOT NULL DEFAULT 75,
      whatsapp_group_link TEXT NOT NULL,
      preview_video_url TEXT NOT NULL,
      instructor_name VARCHAR(255) NOT NULL,
      instructor_role VARCHAR(255) NOT NULL,
      contact_email VARCHAR(255) NOT NULL,
      contact_phone VARCHAR(50) NOT NULL,
      contact_address TEXT NOT NULL,
      meta_pixel_id VARCHAR(100) NOT NULL DEFAULT '',
      razorpay_env VARCHAR(20) NOT NULL DEFAULT 'test',
      razorpay_key_id TEXT NOT NULL DEFAULT '',
      razorpay_key_secret TEXT NOT NULL DEFAULT '',
      razorpay_webhook_secret TEXT NOT NULL DEFAULT '',
      hero_headline TEXT NOT NULL DEFAULT 'Transform the Way You Manage Your School.',
      hero_subheadline TEXT NOT NULL DEFAULT 'Join our practical online workshop to explore smarter approaches to school administration, student records, fee management, attendance, and everyday school operations.',
      hero_badge TEXT NOT NULL DEFAULT 'GARVI EDUCATION PRESENTS | Online Workshop',
      announcement_text TEXT NOT NULL DEFAULT 'Online School Management Workshop • Saturday, 25 October 2026 • 6:00 PM IST',
      whatsapp_support_number VARCHAR(50) NOT NULL DEFAULT '9425100000'
    );

    CREATE TABLE IF NOT EXISTS garvi_contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      mobile VARCHAR(32) NOT NULL,
      email VARCHAR(255) NOT NULL,
      school VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS garvi_notifications_log (
      id SERIAL PRIMARY KEY,
      registration_id VARCHAR(64) NOT NULL,
      channel VARCHAR(20) NOT NULL,
      template_name VARCHAR(100) NOT NULL,
      recipient VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL,
      error_message TEXT,
      sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS garvi_analytics_events (
      id SERIAL PRIMARY KEY,
      event_name VARCHAR(100) NOT NULL,
      event_id VARCHAR(100),
      registration_id VARCHAR(64),
      utm_source VARCHAR(100),
      utm_campaign VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO garvi_settings (
      id, workshop_title, workshop_date, workshop_time, duration, price, max_seats,
      whatsapp_group_link, preview_video_url, instructor_name, instructor_role,
      contact_email, contact_phone, contact_address, meta_pixel_id,
      razorpay_env, razorpay_key_id, razorpay_key_secret, razorpay_webhook_secret,
      hero_headline, hero_subheadline, hero_badge, announcement_text, whatsapp_support_number
    ) VALUES (
      1,
      'Online School Management Workshop',
      'Saturday, 25 October 2026',
      '6:00 PM – 8:00 PM IST',
      '2 Hours Interactive Live Session',
      199,
      75,
      'https://chat.whatsapp.com/GarviEducationWorkshop',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'Senior School Operations Specialist',
      'Garvi Education Academic Panel',
      'contact@garvieducation.com',
      '+91 94251 00000',
      'Garvi Education, Civil Lines, Rewa, Madhya Pradesh 486001',
      '',
      'test',
      '',
      '',
      '',
      'Transform the Way You Manage Your School.',
      'Join our practical online workshop to explore smarter approaches to school administration, student records, fee management, attendance, and everyday school operations.',
      'GARVI EDUCATION PRESENTS | Online Workshop',
      'Online School Management Workshop • Saturday, 25 October 2026 • 6:00 PM IST',
      '9425100000'
    ) ON CONFLICT (id) DO NOTHING;
  `;

  await client.query(sql);
  console.log('PostgreSQL garvi tables initialized successfully!');
  await client.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  client.end();
  process.exit(1);
});
