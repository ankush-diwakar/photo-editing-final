const router = require('express').Router();
const {authController, fetchController} = require('../../controllers/admin/adminController')
const passport = require('passport');


router.post("/signup",authController.signup);
router.post("/signin",authController.signin);
router.post("/create",passport.authenticate('jwt',{session:false}),authController.create);
router.get("/",fetchController.getAdmins);
router.delete("/:id",fetchController.deleteAdmin);
module.exports = router