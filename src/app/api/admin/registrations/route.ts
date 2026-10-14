import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Registration } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const isExport = searchParams.get('export') === 'csv';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = 'SELECT * FROM registrations WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ` AND (
        registration_id LIKE ? OR
        full_name LIKE ? OR
        email LIKE ? OR
        mobile LIKE ? OR
        school_name LIKE ? OR
        city LIKE ?
      )`;
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC';

    if (!isExport) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const rows = db.prepare(query).all(...params) as Registration[];

    // CSV Export support
    if (isExport) {
      const headers = [
        'Registration ID',
        'Full Name',
        'Mobile',
        'Email',
        'School Name',
        'City',
        'Role',
        'Amount',
        'Status',
        'Order ID',
        'Payment ID',
        'UTM Source',
        'UTM Campaign',
        'Created At',
      ];

      const csvRows = [headers.join(',')];

      rows.forEach((r) => {
        const line = [
          `"${r.registration_id}"`,
          `"${(r.full_name || '').replace(/"/g, '""')}"`,
          `"${r.mobile}"`,
          `"${r.email}"`,
          `"${(r.school_name || '').replace(/"/g, '""')}"`,
          `"${(r.city || '').replace(/"/g, '""')}"`,
          `"${(r.role || '').replace(/"/g, '""')}"`,
          r.amount,
          `"${r.status}"`,
          `"${r.razorpay_order_id || ''}"`,
          `"${r.razorpay_payment_id || ''}"`,
          `"${r.utm_source || ''}"`,
          `"${r.utm_campaign || ''}"`,
          `"${r.created_at}"`,
        ];
        csvRows.push(line.join(','));
      });

      const csvContent = csvRows.join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="garvi_registrations_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM registrations WHERE 1=1';
    const countParams: any[] = [];
    if (search) {
      countQuery += ` AND (
        registration_id LIKE ? OR
        full_name LIKE ? OR
        email LIKE ? OR
        mobile LIKE ? OR
        school_name LIKE ? OR
        city LIKE ?
      )`;
      const pattern = `%${search}%`;
      countParams.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const totalCount = (db.prepare(countQuery).get(...countParams) as { total: number })?.total || 0;

    return NextResponse.json({
      registrations: rows,
      total: totalCount,
      limit,
      offset,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
