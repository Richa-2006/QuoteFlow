const Invoice = require('../models/Invoice');
const Quote   = require('../models/Quote');

// POST /api/invoices/:quoteId — vendor converts approved quote to invoice
const createInvoice = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (quote.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (quote.status !== 'approved') {
      return res.status(400).json({ message: 'Quote must be approved before converting to invoice' });
    }

    const existing = await Invoice.findOne({ quoteId: quote._id });
    if (existing) return res.status(400).json({ message: 'Invoice already exists for this quote' });

    const invoice = await Invoice.create({
      quoteId:     quote._id,
      vendorId:    quote.vendorId,
      clientId:    quote.clientId,
      totalAmount: quote.totalAmount,
    });

    await invoice.populate([
      { path: 'quoteId' },
      { path: 'vendorId', select: 'name businessName email' },
      { path: 'clientId', select: 'name email' },
    ]);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/invoices — scoped by role
const getInvoices = async (req, res) => {
  try {
    const filter = req.user.role === 'vendor'
      ? { vendorId: req.user._id }
      : { clientId: req.user._id };

    const invoices = await Invoice.find(filter)
      .populate('quoteId')
      .populate('vendorId', 'name businessName email')
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/invoices/:id
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('quoteId')
      .populate('vendorId', 'name businessName email')
      .populate('clientId', 'name email');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const isOwner =
      invoice.vendorId._id.toString() === req.user._id.toString() ||
      invoice.clientId._id.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Access denied' });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/invoices/:id/status — vendor marks as paid
const updatePaymentStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    invoice.paymentStatus = req.body.paymentStatus;
    await invoice.save();
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updatePaymentStatus };
