import { NextRequest, NextResponse } from 'next/server';
import { db, connections } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { connectionId } = await request.json();

    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID required' }, { status: 400 });
    }

    // Update connection status
    await db.update(connections)
      .set({
        status: 'ended',
        endedAt: new Date(),
      })
      .where(eq(connections.id, connectionId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error ending connection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}