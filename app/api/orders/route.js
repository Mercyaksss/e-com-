import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { firstName, lastName, email, phone, items, subtotal, total } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Customer info is required' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must have at least one item' }, { status: 400 });
    }

    const order = await Order.create({
      customer: { firstName, lastName, email, phone },
      items,
      subtotal,
      total,
    });

    return NextResponse.json(
      { success: true, orderId: order.orderId, _id: order._id },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}