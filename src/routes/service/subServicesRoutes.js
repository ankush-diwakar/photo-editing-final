const { subServicesController } = require("../../controllers/services/subServicesController");
const { uploadSubServiceImages } = require("../../middleware/multer");
const router = require("express").Router();

router.post("/",subServicesController.createSubService);
router.post("/many",subServicesController.createManySubServices);
router.post("/withPrices",subServicesController.createSubServiceWithPrices);

router.post(
    '/withPricesAndImages',
    uploadSubServiceImages,
    subServicesController.createSubServiceWithPricesAndImages2
);
router.put(
    '/updatesubservice/:id',
    uploadSubServiceImages, // Same Multer middleware as create
    subServicesController.updateSubServiceWithPrices2
);
router.delete('/delete/:id', subServicesController.deleteSubServiceUpdated);

router.get("/",subServicesController.getAllSubServices);
router.get("/service/:id",subServicesController.getAllSubServicesWithId);
// router.get("/:id",subServicesController.getSubService);
router.get("/:id",subServicesController.getServiceWithSubServices);
router.put("/:id",subServicesController.updateSubService);
router.delete("/:id",subServicesController.deleteSubService);

router.put('/api/subServices/add-default-prices', subServicesController.updateMissingPricesForAllSubServices);

module.exports = router;