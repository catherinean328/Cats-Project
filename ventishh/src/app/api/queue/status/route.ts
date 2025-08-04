import { NextRequest, NextResponse } from 'next/server';
import { db, queueUsers, connections } from '@/lib/db';
import { eq, and, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    // Get queue counts
    const listeners = await db.select()
      .from(queueUsers)
      .where(and(
        eq(queueUsers.role, 'listener'),
        eq(queueUsers.isOnline, true)
      ));

    const venters = await db.select()
      .from(queueUsers)
      .where(and(
        eq(queueUsers.role, 'venter'),
        eq(queueUsers.isOnline, true)
      ));

    // Check for active connection if sessionId provided
    let activeConnection = null;
    if (sessionId) {
      const userConnections = await db.select({
        connection: connections,
        listenerUser: queueUsers,
      })
      .from(connections)
      .leftJoin(queueUsers, eq(connections.listenerUserId, queueUsers.id))
      .where(and(
        eq(connections.status, 'connecting'),
        isNull(connections.endedAt)
      ));

      // Find connection where user is involved
      for (const conn of userConnections) {
        const venterUser = await db.select()
          .from(queueUsers)
          .where(eq(queueUsers.id, conn.connection.venterUserId))
          .limit(1);

        if (venterUser.length > 0) {
          const venter = venterUser[0];
          if (conn.listenerUser?.sessionId === sessionId || venter.sessionId === sessionId) {
            activeConnection = {
              ...conn.connection,
              listenerUser: conn.listenerUser,
              venterUser: venter,
            };
            break;
          }
        }
      }
    }

    return NextResponse.json({
      listeners: {
        count: listeners.length,
        data: listeners.map(l => ({
          id: l.id,
          username: l.telegramUsername,
          joinedAt: l.joinedAt,
        })),
      },
      venters: {
        count: venters.length,
        data: venters.map(v => ({
          id: v.id,
          joinedAt: v.joinedAt,
        })),
      },
      activeConnection,
    });

  } catch (error) {
    console.error('Error getting queue status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}