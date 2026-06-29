const QuoteRequest = require('../models/QuoteRequest');

// POST /api/requests — client submits a request
const createRequest = async (req, res) => {
  try {
    const { vendorId, items, description, budget } = req.body;
    const request = await QuoteRequest.create({
      clientId: req.user._id,
      vendorId,
      items,
      description,
      budget,
    });
    await request.populate(['clientId', 'vendorId'], 'name email businessName');
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests — client sees own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await QuoteRequest.find({ clientId: req.user._id })
      .populate('vendorId', 'name businessName category')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/incoming — vendor sees incoming requests
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await QuoteRequest.find({ vendorId: req.user._id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/:id — get single request
const getRequestById = async (req, res) => {
  try {
    const request = await QuoteRequest.findById(req.params.id)
      .populate('clientId', 'name email')
      .populate('vendorId', 'name businessName');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isOwner =
      request.clientId._id.toString() === req.user._id.toString() ||
      request.vendorId._id.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Access denied' });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, getIncomingRequests, getRequestById };
