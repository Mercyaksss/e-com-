import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId:     { type: String, required: true },
  name:          { type: String, required: true },
  brand:         { type: String, required: true },
  price:         { type: Number, required: true },
  quantity:      { type: Number, required: true },
  selectedSize:  { type: String, required: true },
  selectedColor: { type: String, required: true },
  image:         { type: String, default: '' },
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: () => '#SOLE-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    unique: true,
  },
  customer: {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true },
    phone:     { type: String, required: true },
    address:   { type: String, default: 'Store Pickup' },
  },
  items:          { type: [OrderItemSchema], required: true },
  subtotal:       { type: Number, required: true },
  deliveryOption: { type: String, default: 'Store Pickup' },
  deliveryFee:    { type: Number, default: 0 },
  total:          { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod:    { type: String, default: 'Card' },
  paymentReference: { type: String, default: '' },
  paymentStatus:    { type: String, default: 'unpaid' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);