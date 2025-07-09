const express = require('express');
const router = express.Router();
const serviceImageController = require('../../controllers/carousal/serviceImageController');
const { uploadServiceImages } = require('../../middleware/multer'); // Import the new middleware

// Get all images for a service
router.get('/service/:serviceId', serviceImageController.getServiceImages);

// Get all services (for dropdown)
router.get('/services', serviceImageController.getAllServices);

// Bulk operations with file upload
router.post('/bulk-insert', uploadServiceImages, serviceImageController.bulkInsertWithFiles);

// Reorder images
router.put('/reorder', serviceImageController.reorderImages);

// Bulk delete
router.delete('/bulk-delete', serviceImageController.bulkDelete);

// Individual delete
router.delete('/:id', serviceImageController.deleteImage);

module.exports = router;