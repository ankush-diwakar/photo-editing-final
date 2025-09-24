const express = require('express');
const { uploadHeroImage, uploadHeroVideo } = require('../middleware/multer');
const heroController = require('../controllers/heroController');

const router = express.Router();

// Public routes
router.get('/slides', heroController.getAllSlides);
// router.get('/video', heroController.getHeroVideo);

// Admin routes
router.get('/admin/slides', heroController.getAllSlides);

router.get('/admin/videos', heroController.getAllVideos);
router.post('/admin/slides', uploadHeroImage, heroController.createSlide);
router.put('/admin/slides/:id', uploadHeroImage, heroController.updateSlide);
router.delete('/admin/slides/:id', heroController.deleteSlide);
router.delete('/admin/slides/:id/permanent', heroController.permanentDeleteSlide);
router.post('/admin/video', uploadHeroVideo, heroController.uploadVideo);
router.delete('/admin/video/:id', heroController.deleteVideo);

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const heroController = require("../controllers/heroController");

// // ---------- Public Routes ----------
// router.get("/slides", heroController.getAllSlides);
// router.get("/videos", heroController.getAllVideos);

// // ---------- Admin Routes ----------
// router.post("/slides", heroController.addSlide);
// router.delete("/slides/:id", heroController.deleteSlide);

// module.exports = router;
