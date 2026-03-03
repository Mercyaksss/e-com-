import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}