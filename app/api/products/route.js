import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Products';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const brand    = searchParams.get('brand');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search   = searchParams.get('search');

    const filter = {};

    if (brand)    filter.brand    = brand;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(products);

  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}