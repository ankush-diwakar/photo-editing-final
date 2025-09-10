const express = require('express');
const router = express.Router();
const { getAllQuoteRequests } = require('../controllers/quoteRequestController');

// Route to get all quote requests
router.get('/', getAllQuoteRequests);

module.exports = router;
