const { priceController } = require("../../controllers/services/priceController");

const router = require("express").Router();

router.post("/",priceController.addPrice);
router.post("/multiple",priceController.addMultiplePrices);
router.get("/",priceController.getAllPrices);
router.put("/:id",priceController.updatePrice);
router.delete("/:id",priceController.deletePrice);
router.get('/currencies', priceController.getAllCurrencies);

module.exports = router;