import { NextRequest, NextResponse } from 'next/server';
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from '@/lib/db';

export async function GET() {
  try {
    const messages = getContactMessages();
    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required.' }, { status: 400 });
    }
    const success = updateContactMessageStatus(id, status);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '', 10);
    if (!id) {
      return NextResponse.json({ error: 'Valid id required.' }, { status: 400 });
    }
    const success = deleteContactMessage(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
