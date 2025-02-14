const express = require("express");
const router = express.Router();
const MainController = require("../../controllers/user_controllers");
// const asyncHandler = require("../../middleware/asyncHandler");

// router.post("/update-phone", MainController.updatePhone);
// router.post("/update-email", MainController.updateEmail);
// // router.post("/update-password", MainController.updatePassword);
// router.post("/update-roles", MainController.updateRoles);
// // create user and update user
// router.post("/form ", MainController.saveForm);
// router.get("/form/:id?", MainController.getForm);
// // delete user
// router.get("/delete/:id", MainController.deleteItem);
// get all
router.get("/", MainController.getAll);
module.exports = router;