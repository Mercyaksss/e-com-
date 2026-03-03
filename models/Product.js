import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  brand:       { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  gender:      { type: String, default: 'Unisex' },
  sizes:       { type: [Number], default: [] },
  colors:      { type: [String], default: [] },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  badge:       { type: String, default: null },
  stock:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);