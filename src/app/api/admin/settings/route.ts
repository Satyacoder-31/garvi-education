import { NextRequest, NextResponse } from 'next/server';
import { getWorkshopSettings, updateWorkshopSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getWorkshopSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateWorkshopSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
