const User = require('../models/User');

// GET /api/vendors — list all vendors (paginated)
const getVendors = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;


    
    const query = { role: 'vendor' };
    if (req.query.category) query.category = new RegExp(req.query.category, 'i');
    if (req.query.search)   query.businessName = new RegExp(req.query.search, 'i');

    const [vendors, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.json({ vendors, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/vendors/:id — single vendor profile
const getVendorById = async (req, res) => {
  try {
    const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' }).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getVendors, getVendorById };
