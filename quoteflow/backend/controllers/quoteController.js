const Quote = require('../models/Quote');
const QuoteRequest = require('../models/QuoteRequest');

// POST /api/quotes/from-request/:reqId — vendor creates quote from request
const createQuote = async (req, res) => {
  try {
    const request = await QuoteRequest.findById(req.params.reqId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { items, taxRate } = req.body;
    const quote = await Quote.create({
      requestId: request._id,
      vendorId:  req.user._id,
      clientId:  request.clientId,
      items,
      taxRate: taxRate || 0,
    });

    // Mark request as quoted
    request.status = 'quoted';
    await request.save();

    await quote.populate(['vendorId', 'clientId'], 'name email businessName');
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quotes — scoped by role
const getQuotes = async (req, res) => {
  try {
    const filter = req.user.role === 'vendor'
      ? { vendorId: req.user._id }
      : { clientId: req.user._id };

    const quotes = await Quote.find(filter)
      .populate('vendorId', 'name businessName')
      .populate('clientId', 'name email')
      .populate('requestId')
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quotes/:id
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('vendorId', 'name businessName email')
      .populate('clientId', 'name email')
      .populate('requestId');
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    const isOwner =
      quote.vendorId._id.toString() === req.user._id.toString() ||
      quote.clientId._id.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Access denied' });

    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/quotes/:id — vendor edits quote
const updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (quote.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { items, taxRate } = req.body;
    if (items)   quote.items   = items;
    if (taxRate !== undefined) quote.taxRate = taxRate;
    quote.status = 'sent';
    quote.revisionNote = '';
    await quote.save();

    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/quotes/:id/approve — client approves
const approveQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (quote.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    quote.status = 'approved';
    await quote.save();
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/quotes/:id/revise — client requests revision
const requestRevision = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (quote.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    quote.status = 'revision';
    quote.revisionNote = req.body.note || '';
    await quote.save();
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuote, getQuotes, getQuoteById, updateQuote, approveQuote, requestRevision };
