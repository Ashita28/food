const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    qnt: { type: Number, required: true, min: 1, default: 1 },
    avgPrepTime: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    shortId: { type: String, unique: true, index: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    tax: { type: Number, required: true, min: 0, default: 0 },
    delivery: { type: Number, required: true, min: 0, default: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['processing', 'done', 'pickup'], default: 'processing', index: true },
    orderType: { type: String, enum: ['dine-in', 'takeaway'], default: 'dine-in' },
    note: { type: String, trim: true, default: '' },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', default: null, index: true },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (this.shortId) return next(); 

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'order' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNum = counter.seq;
    this.shortId = seqNum.toString().padStart(3, '0'); 
    next();
  } catch (err) {
    console.error('Error generating shortId:', err);
    next(err);
  }
});

module.exports = mongoose.model('Order', orderSchema);
