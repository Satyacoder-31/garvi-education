import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  getRegistrationById,
} from '@/lib/db';
import { normalizeIndianPhoneNumber } from '@/lib/aisensy';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const isExport = searchParams.get('export') === 'csv';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { registrations, total } = await getAdminRegistrations({
      search,
      status,
      limit,
      offset,
      isExport,
    });

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

      registrations.forEach((r) => {
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

    return NextResponse.json({
      registrations,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new participant manually from Admin Panel
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, mobile, email, schoolName, city, role, amount, status } = body;

    if (!fullName || !mobile || !email || !schoolName) {
      return NextResponse.json(
        { error: 'Name, mobile, email, and school name are required.' },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const registrationId = `GARVI-${year}-${randomSuffix}`;

    await createRegistration({
      registration_id: registrationId,
      full_name: fullName.trim(),
      mobile: normalizeIndianPhoneNumber(mobile),
      email: email.trim().toLowerCase(),
      school_name: schoolName.trim(),
      city: city ? city.trim() : 'Rewa',
      role: role ? role.trim() : 'School Administrator',
      amount: amount ? parseInt(amount, 10) : 199,
      utm_source: 'admin_manual',
    });

    if (status && status !== 'pending_payment') {
      await updateRegistration(registrationId, { status });
    }

    const saved = await getRegistrationById(registrationId);

    return NextResponse.json({
      success: true,
      registration: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update participant details and status from Admin Panel
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationId, updates } = body;

    if (!registrationId || !updates) {
      return NextResponse.json(
        { error: 'registrationId and updates payload are required.' },
        { status: 400 }
      );
    }

    const updated = await updateRegistration(registrationId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a registration record from Admin Panel
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required.' }, { status: 400 });
    }

    const deleted = await deleteRegistration(registrationId);
    if (!deleted) {
      return NextResponse.json({ error: 'Registration not found or could not be deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
