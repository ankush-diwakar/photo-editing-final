const { serviceController } = require('../../controllers/services/serviceController');
const passport = require('passport');
const { upload } = require('../../middleware/multer');
const router = require('express').Router();

router.post("/", upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), serviceController.createService2);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getService);
router.put("/:id", upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), serviceController.updateService2);
router.delete("/:id", serviceController.deleteService);
router.post("/test", upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), serviceController.testService)
module.exports = router

