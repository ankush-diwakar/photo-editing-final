
const router = require('express').Router();
const PriceController = require('../../controllers/prices/price');


router.get("/",PriceController.getServicesWithPrices);

module.exports = router;