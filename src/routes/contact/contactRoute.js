const router = require('express').Router();
const { contactController } = require('../../controllers/contact/contactControllers');

router.post("/addnew", contactController.addNewContactLead);
router.get("/all-leads", contactController.getAllContactLeads);


module.exports = router;
