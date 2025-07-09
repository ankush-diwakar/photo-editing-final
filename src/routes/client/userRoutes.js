const router = require('express').Router();

const {authController, fetchController} = require('../../controllers/client/userController')


router.post("/signup",authController.signup);
router.post("/signin",authController.signin);
router.post("/verify-email",authController.verifyEmail);
router.post("/reset-password",authController.resetPassword);
router.post("/confirm-password",authController.resetPasswordconfirm)
router.get("/",fetchController.getAllUsers);
router.delete("/:id",fetchController.deleteUser);

module.exports = router