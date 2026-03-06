import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const brand    = searchParams.get('brand');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const query = {};
    if (brand)    query.brand    = { $regex: brand, $options: 'i' };
    if (category) query.category = { $in: [category] };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, brand, price, category, description, images, variants, badge } = body;

    if (!name || !price || !variants || variants.length === 0) {
      return NextResponse.json({ error: 'Name, price and at least one variant are required' }, { status: 400 });
    }

    const product = await Product.create({
      name, brand, price: Number(price),
      category: Array.isArray(category) ? category : [category].filter(Boolean),
      description, images, variants, badge: badge || null,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}