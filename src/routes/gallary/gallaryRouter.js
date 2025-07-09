const router = require('express').Router();
const { gallaryController } = require('../../controllers/gallary/gallaryController');
const { uploadSubServiceImages } = require('../../middleware/multer');

router.post("/new-item", uploadSubServiceImages, gallaryController.addNewGallaryItem);
router.get("/all-items", gallaryController.getAllGallayItems);
router.get("/all-items2", gallaryController.getGroupedGalleryItems);
router.get("/all-services", gallaryController.getAllServices);
router.put("/:id", uploadSubServiceImages, gallaryController.updateGallaryItem);
router.post("/reorder", gallaryController.reorderGalleryItems); // New endpoint
router.delete("/:id", gallaryController.deleteGallaryItem);

//new
router.put("/update-display-orders", gallaryController.updateDisplayOrders);

module.exports = router;