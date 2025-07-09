const express = require('express');
const router = express.Router();
const jobOpeningsController = require('../../controllers/jobopening/jobOpeningsController');
const { upload } = require('../../middleware/multer');

// Multer config for cover letter and resume
const applicationUpload = upload.fields([
  { name: 'coverLetter', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

// Get all active job openings
router.get('/', jobOpeningsController.getAllJobOpenings);

// Create a new job opening
router.post('/', jobOpeningsController.createJobOpening);
router.put('/:id', jobOpeningsController.updateJob);
router.delete('/:id', jobOpeningsController.deleteJob);

// Routes
router.get('/job-openings', jobOpeningsController.getJobOpenings);
router.post('/job-applications', applicationUpload, jobOpeningsController.submitJobApplication);

module.exports = router;