const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total:     { type: Number },
});



const quoteSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuoteRequest',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [lineItemSchema],
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  subtotal:    { type: Number },
  taxAmount:   { type: Number },
  totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'revision'],
    default: 'sent',
  },
  revisionNote: {
    type: String,
  },
}, { timestamps: true });

// Auto-calculate totals before save
quoteSchema.pre('save', function (next) {
  this.items = this.items.map(item => ({
    ...item.toObject(),
    total: item.quantity * item.unitPrice,
  }));
  this.subtotal    = this.items.reduce((sum, item) => sum + item.total, 0);
  this.taxAmount   = (this.subtotal * this.taxRate) / 100;
  this.totalAmount = this.subtotal + this.taxAmount;
  next();
});

module.exports = mongoose.model('Quote', quoteSchema);
