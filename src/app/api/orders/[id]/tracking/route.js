import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, shipmentTrackingEvents } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import { canAccessOrder } from '@/lib/order-access';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // This endpoint persists courier status, so it uses the same authorization contract as
    // GET /api/orders/[id] and must not be reachable anonymously.
    const { searchParams } = new URL(request.url);
    const accessCode = searchParams.get('accessCode');

    if (!canAccessOrder(user, order, accessCode)) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Retrieve cached timeline
    const cachedEvents = await db
      .select()
      .from(shipmentTrackingEvents)
      .where(eq(shipmentTrackingEvents.orderId, id))
      .orderBy(asc(shipmentTrackingEvents.eventTimestamp));

    return NextResponse.json({
      courierProvider: order.courierProvider || 'manual',
      awbNumber: order.awbNumber,
      courierStatus: order.courierStatus || 'Tracking details will be updated manually',
      unavailable: false,
      events: cachedEvents,
    });
  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipment tracking details' },
      { status: 500 }
    );
  }
}
