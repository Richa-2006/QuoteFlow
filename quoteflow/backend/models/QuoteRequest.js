const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit:     { type: String, default: 'pcs' },
});

const quoteRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [itemSchema],
  description: {
    type: String,
    trim: true,
  },
  budget: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'quoted', 'closed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
