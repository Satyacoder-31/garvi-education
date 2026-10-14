# Garvi Education — Online School Management Workshop Platform

An ultra-premium, conversion-focused landing page and automated registration funnel built for **Garvi Education** (Rewa, Madhya Pradesh, India).

Designed specifically to convert Meta Ads visitors into paid workshop registrations at **₹199** with institutional trust, photorealistic visuals, server-side payment verification, automated AiSensy WhatsApp & Email dispatch, and an executive administration dashboard.

---

## 🌟 Key Features

### 1. Ultra-Premium Editorial Design
- **Color Palette:** Pure white and warm off-white canvas, deep navy typography (`#0A192F`), royal blue accents (`#1D4ED8`), subtle cyan highlights, and dark navy primary CTAs.
- **Typography:** Plus Jakarta Sans for headings and Inter for body copy.
- **Original High-Resolution Generated Visuals:**
  - Modern Indian school administrator at an executive desk (`/public/images/hero-administrator.jpg`)
  - Principal & administrator collaborating in contemporary boardroom (`/public/images/principal-collaboration.jpg`)
  - Modern school digital operations and analytics hub (`/public/images/school-operations.jpg`)
  - Workshop presenter masterclass thumbnail with play-button overlay (`/public/images/presenter-preview.jpg`)
  - School leadership audience showcase (`/public/images/school-leaders.jpg`)

### 2. Full 13-Section Landing Page Structure
1. **Premium Announcement Bar:** Slim top bar displaying live batch schedule and seat availability.
2. **Minimal Sticky Navigation:** Brand emblem, smooth scrolling links, and quick register CTA.
3. **High-Converting Hero Section:** Eyebrow tag, strong headline, 3 core benefit bullets, dual CTAs (Register ₹199 / Watch Preview), truthful trust indicators, and layered floating dashboard cards.
4. **Problem & Opportunity:** 4 refined challenge cards (Disorganized Records, Time Drain, Fee Tracking, Operations) + Modern School Advantage solution card.
5. **Workshop Outcomes:** 6-card curriculum grid covering School Fundamentals, Student Dossiers, Attendance Workflows, Fee Management, Parent Communication, and Rollout Strategy.
6. **Video Preview Section:** Player-style thumbnail with interactive video modal and branded briefing panel.
7. **Who Should Attend:** Tailored role profiles for School Owners, Principals, Operations Staff, and Trustees.
8. **Workshop Agenda:** Clean vertical timeline with 4 focused 30-minute sessions and verified outcomes.
9. **Social Proof & Reviews:** Authentic feedback cards with school designations and verified badges.
10. **Transparent Pricing:** ₹199 one-time fee card with complete list of inclusions and security credentials.
11. **FAQ Accordion:** All 9 required questions with smooth expand/collapse and Rewa helpline box.
12. **Final Conversion Section:** High-contrast editorial card with direct registration trigger.
13. **Footer:** Rewa, MP contact details, official helpline, working policy links, and copyright notice.

### 3. Automated Registration & Payment Funnel
- **Registration Form:** Collects Name, Mobile (with +91 normalization and 10-digit validation), Email, School Name, City/District, and Role with opt-in consent.
- **UTM Attribution:** Automatically captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term` from the URL and persists them with the registration record.
- **Razorpay Integration:**
  - Server-side order creation (`/api/register`) with unique registration IDs (`GARVI-2026-XXXXX`).
  - Strict server-side HMAC SHA256 signature verification (`/api/payment/verify`).
  - Webhook listener (`/api/payment/webhook`) with idempotent transaction handling.
  - Built-in **Sandbox Payment Simulator** so developers and clients can test success and failure scenarios instantly without requiring live merchant credentials!
- **Thank You Page (`/thank-you`):**
  - Displays participant name, unique Registration ID, schedule, and verified receipt.
  - Prominent **"Join Workshop WhatsApp Group"** CTA.
  - **Add to Calendar (.ics)** download button.
  - Confetti celebration effect.

### 4. Email & AiSensy WhatsApp Automation
- **AiSensy WhatsApp API (`src/lib/aisensy.ts`):** Sends automated registration confirmations with workshop schedule and WhatsApp group links. Includes reminder automation for 1-day before and 1-hour before the session.
- **Transactional Email (`src/lib/email.ts`):** Sends responsive HTML confirmation emails with participant details and workshop access instructions.
- **Automatic Fallback:** When API keys are not yet configured in `.env`, automations safely log formatted simulated payloads to the database so you can test without error.

### 5. Meta Ads Tracking & Conversions API (CAPI)
- **Browser Meta Pixel (`src/components/analytics/meta-pixel.tsx`):** Tracks `PageView`, `ViewContent`, `Lead` (upon form submit), and `InitiateCheckout`.
- **Server-Side Meta Conversions API (`src/lib/meta-capi.ts`):** Fires verified `Purchase` events from the backend only after cryptographic payment verification, passing ₹199 INR value and deduplication `event_id`.

### 6. Administrator Dashboard (`/admin`)
- **Protected Access:** Simple password authentication (`garvi@admin2026`).
- **Real-Time Analytics:** Visitors, Leads, Checkouts, Verified Paid Registrations, Conversion Rate %, and Total Verified Revenue.
- **Campaign Reporting:** Table grouping leads, conversions, and revenue by UTM campaign and source.
- **Registrations Manager:** Real-time search, status filter (`Confirmed Paid`, `Pending`, `Failed`), and one-click **CSV Export**.
- **Actions:** Resend WhatsApp or Email notifications to participants with a single click.
- **Workshop Settings:** Live editor for workshop date, time, pricing, WhatsApp group link, preview video URL, and contact details.
- **Notification Logs:** Detailed audit trail of all outbound messages and error statuses.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Administrator Credentials

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Password:** `garvi@admin2026`
*(Can be changed in `.env.local` via `ADMIN_PASSWORD`)*

---

## ⚙️ Environment Variables (`.env.example`)

Copy `.env.example` to `.env.local` to configure live credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID for frontend checkout |
| `RAZORPAY_KEY_ID` | Razorpay Key ID for backend order creation |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret for signature verification |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret |
| `AISENSY_API_KEY` | AiSensy API Key for WhatsApp Business |
| `AISENSY_CAMPAIGN_NAME` | AiSensy campaign template for registration confirmation |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `FROM_EMAIL` | Sender email address (e.g. `workshops@garvieducation.com`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID for browser tracking |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversions API Access Token |
| `ADMIN_PASSWORD` | Password for `/admin` access |

---

## 🗄️ Database Architecture

The application comes with **better-sqlite3** enabled by default (`data/garvi.db`), requiring **zero setup** to run locally.

### PostgreSQL / Supabase Migration
If deploying to Supabase or a cloud PostgreSQL database:
1. Open your Supabase SQL Editor.
2. Run the migration script located at [`supabase/migrations/01_initial_schema.sql`](supabase/migrations/01_initial_schema.sql).

---

## 🛡️ Policy Pages Included
- [Privacy Policy](http://localhost:3000/privacy) — IT Act 2000 & Meta advertising compliant
- [Terms & Conditions](http://localhost:3000/terms) — School workshop participation terms
- [Refund & Cancellation Policy](http://localhost:3000/refund) — Transparent ₹199 refund policies
- [Contact & Support](http://localhost:3000/contact) — Official Rewa, MP contact details and inquiry desk

---

## 🏢 Business Details
- **Organization:** Garvi Education
- **Location:** Civil Lines, Rewa, Madhya Pradesh 486001, India
- **Helpline:** +91 94251 00000
- **Email:** support@garvieducation.com
