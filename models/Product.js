import mongoose from 'mongoose';

const SizeSchema = new mongoose.Schema({
  size:  { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
}, { _id: false });

const VariantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  sizes: { type: [SizeSchema], required: true },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  brand:       { type: String },
  price:       { type: Number, required: true },
  category:    { type: String },
  description: { type: String },
  images:      { type: [String], validate: v => v.length >= 1 },
  variants:    { type: [VariantSchema], required: true },
  badge:       { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);