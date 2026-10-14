import { NextResponse } from 'next/server';
import { getAdminAnalytics } from '@/lib/db';

export async function GET() {
  try {
    const data = await getAdminAnalytics();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
