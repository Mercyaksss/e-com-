import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}