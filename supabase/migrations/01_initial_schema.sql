-- Supabase / PostgreSQL Migration for Garvi Education
-- Run this in your Supabase SQL Editor if migrating to Supabase cloud.

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_reg_order_id ON registrations(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_mobile ON registrations(mobile);

CREATE TABLE IF NOT EXISTS workshop_settings (
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
  meta_pixel_id VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS notifications_log (
  id BIGSERIAL PRIMARY KEY,
  registration_id VARCHAR(64) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_id VARCHAR(100),
  registration_id VARCHAR(64),
  utm_source VARCHAR(100),
  utm_campaign VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Default workshop settings
INSERT INTO workshop_settings (
  id, workshop_title, workshop_date, workshop_time, duration, price, max_seats,
  whatsapp_group_link, preview_video_url, instructor_name, instructor_role,
  contact_email, contact_phone, contact_address, meta_pixel_id
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
  ''
) ON CONFLICT (id) DO NOTHING;
