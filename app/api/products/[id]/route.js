import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const { name, brand, price, category, description, images, variants, badge } = body;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name, brand, price: Number(price),
        category: Array.isArray(category) ? category : [category].filter(Boolean),
        description, images, variants, badge: badge || null,
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}