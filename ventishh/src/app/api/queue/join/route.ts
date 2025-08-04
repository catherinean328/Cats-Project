import { NextRequest, NextResponse } from 'next/server';
import { db, queueUsers, connections } from '@/lib/db';
import { eq, and, isNull } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, role, telegramUsername } = await request.json();

    if (!sessionId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'listener' && !telegramUsername) {
      return NextResponse.json({ error: 'Telegram username required for listeners' }, { status: 400 });
    }

    // Remove user if already in queue
    await db.delete(queueUsers).where(eq(queueUsers.sessionId, sessionId));

    // Add user to queue
    const [newUser] = await db.insert(queueUsers).values({
      sessionId,
      role,
      telegramUsername: role === 'listener' ? telegramUsername : null,
      isOnline: true,
      joinedAt: new Date(),
      lastSeen: new Date(),
    }).returning();

    // Try to find a match
    if (role === 'venter') {
      // Look for available listeners
      const availableListeners = await db.select()
        .from(queueUsers)
        .where(and(
          eq(queueUsers.role, 'listener'),
          eq(queueUsers.isOnline, true)
        ))
        .limit(1);

      if (availableListeners.length > 0) {
        const listener = availableListeners[0];
        
        // Create connection
        const [connection] = await db.insert(connections).values({
          listenerUserId: listener.id,
          venterUserId: newUser.id,
          status: 'connecting',
          createdAt: new Date(),
        }).returning();

        // Remove both users from queue
        await db.delete(queueUsers).where(
          eq(queueUsers.id, listener.id)
        );
        await db.delete(queueUsers).where(
          eq(queueUsers.id, newUser.id)
        );

        return NextResponse.json({
          user: newUser,
          matched: true,
          connection: {
            ...connection,
            listenerUser: listener,
            venterUser: newUser,
          }
        });
      }
    } else if (role === 'listener') {
      // Look for waiting venters
      const waitingVenters = await db.select()
        .from(queueUsers)
        .where(and(
          eq(queueUsers.role, 'venter'),
          eq(queueUsers.isOnline, true)
        ))
        .limit(1);

      if (waitingVenters.length > 0) {
        const venter = waitingVenters[0];
        
        // Create connection
        const [connection] = await db.insert(connections).values({
          listenerUserId: newUser.id,
          venterUserId: venter.id,
          status: 'connecting',
          createdAt: new Date(),
        }).returning();

        // Remove both users from queue
        await db.delete(queueUsers).where(
          eq(queueUsers.id, venter.id)
        );
        await db.delete(queueUsers).where(
          eq(queueUsers.id, newUser.id)
        );

        return NextResponse.json({
          user: newUser,
          matched: true,
          connection: {
            ...connection,
            listenerUser: newUser,
            venterUser: venter,
          }
        });
      }
    }

    return NextResponse.json({
      user: newUser,
      matched: false,
    });

  } catch (error) {
    console.error('Error joining queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}