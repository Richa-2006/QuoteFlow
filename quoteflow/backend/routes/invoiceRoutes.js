const express = require('express');
const router  = express.Router();
const { createInvoice, getInvoices, getInvoiceById, updatePaymentStatus } = require('../controllers/invoiceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/:quoteId',      protect, restrictTo('vendor'), createInvoice);
router.get('/',               protect, getInvoices);
router.get('/:id',            protect, getInvoiceById);
router.patch('/:id/status',   protect, restrictTo('vendor'), updatePaymentStatus);

module.exports = router;
