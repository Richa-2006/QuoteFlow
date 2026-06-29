const express = require('express');
const router  = express.Router();
const { createRequest, getMyRequests, getIncomingRequests, getRequestById } = require('../controllers/requestController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/',          protect, restrictTo('client'), createRequest);
router.get('/',           protect, restrictTo('client'), getMyRequests);
router.get('/incoming',   protect, restrictTo('vendor'), getIncomingRequests);
router.get('/:id',        protect, getRequestById);

module.exports = router;
