const express = require('express');
const router = express.Router();
const freeTrialLeadsController = require('../../controllers/freeTrial/freeTrialLeadsController');

// Create a new free trial lead
router.post('/', freeTrialLeadsController.createFreeTrialLead);

// Get all free trial leads (optional)
router.get('/', freeTrialLeadsController.getAllFreeTrialLeads);

module.exports = router;