const router = require("express").Router();
const { testimonialController } = require("../../controllers/testimonials/testimonialController");

router.get("/", testimonialController.getTestimonials);


module.exports = router;