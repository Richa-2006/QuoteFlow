const express = require('express');
const router  = express.Router();
const { createQuote, getQuotes, getQuoteById, updateQuote, approveQuote, requestRevision } = require('../controllers/quoteController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/from-request/:reqId', protect, restrictTo('vendor'), createQuote);
router.get('/',                     protect, getQuotes);
router.get('/:id',                  protect, getQuoteById);
router.put('/:id',                  protect, restrictTo('vendor'), updateQuote);
router.patch('/:id/approve',        protect, restrictTo('client'), approveQuote);
router.patch('/:id/revise',         protect, restrictTo('client'), requestRevision);

module.exports = router;
