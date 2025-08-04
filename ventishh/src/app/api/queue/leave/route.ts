import { NextRequest, NextResponse } from 'next/server';
import { db, queueUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Remove user from queue
    await db.delete(queueUsers).where(eq(queueUsers.sessionId, sessionId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error leaving queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}