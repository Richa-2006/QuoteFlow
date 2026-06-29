const express = require('express');
const router  = express.Router();
const { getVendors, getVendorById } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',    protect, getVendors);
router.get('/:id', protect, getVendorById);

module.exports = router;
