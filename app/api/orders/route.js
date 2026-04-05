import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { customer, items, subtotal, total, paymentMethod, paymentStatus, paystackReference, deliveryOption, deliveryFee } = body;

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

    // Check stock for each item before saving order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      const variant = product.variants.find(v => v.color === item.selectedColor);
      if (!variant) return NextResponse.json({ error: `Color not found for ${item.name}` }, { status: 400 });
      const sizeEntry = variant.sizes.find(s => s.size === Number(item.selectedSize));
      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${item.name} in size ${item.selectedSize}` }, { status: 400 });
      }
    }

    const order = await Order.create({
      customer,
      items,
      subtotal,
      deliveryOption: deliveryOption || 'Store Pickup',
      deliveryFee:    deliveryFee    || 0,
      total,
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: paymentStatus || 'Paid',
    });

    // Reduce stock for each item after order is saved
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId, 'variants.color': item.selectedColor },
        { $inc: { 'variants.$[v].sizes.$[s].stock': -item.quantity } },
        { arrayFilters: [{ 'v.color': item.selectedColor }, { 's.size': Number(item.selectedSize) }] }
      );
    }

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