const express = require('express');
const router = express.Router();
const applicationController = require('../../controllers/jobapplications/applicationController');

// Get all applications with optional filtering
router.get('/applications', applicationController.getAllApplications);

// Get specific application by ID
router.get('/applications/:id', applicationController.getApplicationById);

// Download resume
router.get('/applications/:id/resume', applicationController.downloadResume);

// Download cover letter
router.get('/applications/:id/coverletter', applicationController.downloadCoverLetter);

// Get applications by job opening
router.get('/job/:jobId/applications', applicationController.getApplicationsByJob);

module.exports = router;