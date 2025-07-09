const { jobController } = require("../../controllers/services/jobController");
const passport = require('passport');
const router = require("express").Router();

router.post("/",passport.authenticate('jwt',{session:false}), jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/assigned-jobs",passport.authenticate('jwt',{session:false}),jobController.getAssignedJobs)//#
router.get("/user-jobs",jobController.getUserSpecificJobs);
router.get("/client/:clientId", jobController.getJobsByClientId);
// router.get("/:id", jobController.getJob);

router.put("/update-job/:id",passport.authenticate('jwt',{session:false}),jobController.changeJobStatus)
//router.put("/assign-job",jobController.assignJob);//old route
router.put("/:id/assign",jobController.assignJob);        //new route for assigning jobs


router.put("/:id/editor-update",jobController.editorUpdate);        //new route for editor updating jobs#

// router.put("/:id", jobController.updateJob);
router.put("/:id", jobController.updateJobNew);
router.delete("/:id", jobController.deleteJob);

module.exports = router;