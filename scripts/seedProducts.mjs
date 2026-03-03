// One-time script to seed your MongoDB with products
// Run from your project root: node scripts/seedProducts.mjs

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('MONGO_URI not found in .env.local');

const ProductSchema = new mongoose.Schema({
  name: String, brand: String, price: Number, category: String,
  gender: String, sizes: [Number], colors: [String],
  image: String, description: String, badge: String, stock: Number,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
  {
    name: 'Air Max 270', brand: 'Nike', price: 180, category: 'Lifestyle',
    gender: 'Men', sizes: [7,7.5,8,8.5,9,9.5,10,10.5,11,12],
    colors: ['Black', 'White', 'Red'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    description: 'The Nike Air Max 270 delivers unrivaled comfort with the largest Air unit yet.',
    badge: 'New', stock: 24,
  },
  {
    name: 'Ultra Boost 22', brand: 'Adidas', price: 190, category: 'Running',
    gender: 'Men', sizes: [7,7.5,8,8.5,9,9.5,10,10.5,11,12],
    colors: ['White', 'Black', 'Grey'],
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    description: 'Engineered for runners who demand the best. Responsive Boost midsole returns energy with every stride.',
    badge: null, stock: 18,
  },
  {
    name: 'Air Jordan 1 Retro', brand: 'Jordan', price: 220, category: 'Basketball',
    gender: 'Men', sizes: [7,8,9,10,11,12],
    colors: ['Black', 'Red', 'White'],
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
    description: 'The shoe that started it all. Timeless style meets heritage basketball performance.',
    badge: 'Hot', stock: 8,
  },
  {
    name: '990v5 Made in USA', brand: 'New Balance', price: 185, category: 'Lifestyle',
    gender: 'Unisex', sizes: [6,7,8,9,10,11,12],
    colors: ['Grey', 'Navy', 'Black'],
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',
    description: 'Handcrafted in the USA with premium materials. The pinnacle of New Balance craftsmanship.',
    badge: null, stock: 30,
  },
  {
    name: 'RS-X Reinvention', brand: 'Puma', price: 110, category: 'Lifestyle',
    gender: 'Unisex', sizes: [6,7,8,9,10,11],
    colors: ['White', 'Blue', 'Yellow'],
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800',
    description: 'Bold design inspired by late 80s running silhouettes.',
    badge: 'Sale', stock: 5,
  },
  {
    name: 'Chuck Taylor All Star', brand: 'Converse', price: 75, category: 'Lifestyle',
    gender: 'Unisex', sizes: [5,6,7,8,9,10,11,12],
    colors: ['Black', 'White', 'Red', 'Navy'],
    image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800',
    description: 'An American icon since 1917. The most recognisable sneaker in the world.',
    badge: null, stock: 45,
  },
  {
    name: 'Old Skool', brand: 'Vans', price: 80, category: 'Lifestyle',
    gender: 'Unisex', sizes: [5,6,7,8,9,10,11,12],
    colors: ['Black/White', 'Navy', 'Red'],
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
    description: 'The Vans Old Skool is a classic skate shoe with the iconic side stripe.',
    badge: null, stock: 40,
  },
  {
    name: 'Classic Leather', brand: 'Reebok', price: 90, category: 'Lifestyle',
    gender: 'Unisex', sizes: [6,7,8,9,10,11,12],
    colors: ['White', 'Black', 'Green'],
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=800',
    description: 'Born in the 80s fitness era. A timeless staple.',
    badge: null, stock: 22,
  },
  {
    name: 'Gel-Kayano 29', brand: 'Asics', price: 160, category: 'Running',
    gender: 'Men', sizes: [7,7.5,8,8.5,9,9.5,10,10.5,11,12],
    colors: ['Blue', 'Black', 'White'],
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    description: 'Premium stability and cushioning for long distance runners.',
    badge: null, stock: 15,
  },
  {
    name: 'Suede Classic', brand: 'Puma', price: 95, category: 'Lifestyle',
    gender: 'Unisex', sizes: [6,7,8,9,10,11,12],
    colors: ['Black', 'White', 'Blue', 'Red'],
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
    description: 'A streetwear legend since 1968. On the feet of icons for over 50 years.',
    badge: null, stock: 28,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB...');
  await Product.deleteMany({});
  console.log('Cleared existing products...');
  await Product.insertMany(products);
  console.log('Seeded ' + products.length + ' products successfully!');
  await mongoose.disconnect();
  console.log('Done! You can delete this file now.');
}

seed().catch(err => { console.error(err); process.exit(1); });
