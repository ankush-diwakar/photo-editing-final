const express = require('express');
const { uploadHeroImage, uploadHeroVideo } = require('../middleware/multer');
const heroController = require('../controllers/heroController');

const router = express.Router();

// Public routes
router.get('/slides', heroController.getAllSlides);
router.get('/video', heroController.getHeroVideo);

// Admin routes
router.get('/admin/slides', heroController.getAllSlidesAdmin);
router.get('/admin/videos', heroController.getAllVideosAdmin);
router.post('/admin/slides', uploadHeroImage, heroController.createSlide);
router.put('/admin/slides/:id', uploadHeroImage, heroController.updateSlide);
router.delete('/admin/slides/:id', heroController.deleteSlide);
router.delete('/admin/slides/:id/permanent', heroController.permanentDeleteSlide);
router.post('/admin/video', uploadHeroVideo, heroController.uploadVideo);
router.delete('/admin/video/:id', heroController.deleteVideo);

module.exports = router;