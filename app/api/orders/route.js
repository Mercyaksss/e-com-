import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { customer, items, subtotal, total, paymentMethod, paymentStatus, paystackReference } = body;

    if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: 'Customer info is required' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must have at least one item' }, { status: 400 });
    }

    // Verify payment with Paystack before saving order
    if (!paystackReference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 });
    }
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${paystackReference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const order = await Order.create({
      customer,
      items,
      subtotal,
      total,
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: paymentStatus || 'Paid',
    });

    return NextResponse.json(
      { success: true, orderId: order.orderId, _id: order._id },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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