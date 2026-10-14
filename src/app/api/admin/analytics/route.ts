import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const totalLeads = (
      db.prepare('SELECT COUNT(*) as count FROM registrations').get() as { count: number }
    )?.count || 0;

    const verifiedPaid = (
      db.prepare(
        "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as revenue FROM registrations WHERE status IN ('registration_confirmed', 'paid')"
      ).get() as { count: number; revenue: number }
    ) || { count: 0, revenue: 0 };

    const paymentPending = (
      db.prepare("SELECT COUNT(*) as count FROM registrations WHERE status = 'pending_payment'").get() as { count: number }
    )?.count || 0;

    const paymentFailed = (
      db.prepare("SELECT COUNT(*) as count FROM registrations WHERE status = 'payment_failed'").get() as { count: number }
    )?.count || 0;

    const pageViews = (
      db.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_name = 'page_view'").get() as { count: number }
    )?.count || 0;

    // Estimate total visitors from page views or baseline
    const totalVisitors = Math.max(pageViews, totalLeads > 0 ? totalLeads * 3 : 1);
    const conversionRate = totalLeads > 0 ? ((verifiedPaid.count / totalLeads) * 100).toFixed(1) : '0.0';

    // Group by UTM Campaign
    const campaigns = db.prepare(`
      SELECT
        COALESCE(utm_campaign, 'Direct / Organic') as utm_campaign,
        COALESCE(utm_source, 'None') as utm_source,
        COUNT(*) as leads,
        SUM(CASE WHEN status IN ('registration_confirmed', 'paid') THEN 1 ELSE 0 END) as conversions,
        SUM(CASE WHEN status IN ('registration_confirmed', 'paid') THEN amount ELSE 0 END) as revenue
      FROM registrations
      GROUP BY utm_campaign, utm_source
      ORDER BY conversions DESC, leads DESC
      LIMIT 10
    `).all() as any[];

    // Recent 10 notification logs
    const recentNotifications = db.prepare(`
      SELECT * FROM notifications_log ORDER BY id DESC LIMIT 10
    `).all() as any[];

    return NextResponse.json({
      summary: {
        totalVisitors,
        totalLeads,
        paymentPending,
        paymentFailed,
        verifiedRegistrations: verifiedPaid.count,
        totalRevenue: verifiedPaid.revenue,
        conversionRate: `${conversionRate}%`,
      },
      campaigns,
      recentNotifications,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
