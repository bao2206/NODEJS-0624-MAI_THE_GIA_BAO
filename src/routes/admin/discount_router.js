const express = require("express");
const router = express.Router();
const MainController = require("../../controllers/discount_controllers");
const {asyncHandle} =  require("../../utils/asyncHandle");
// const upload = require("../../middleware/upload");

router.post("/update-status/:id", asyncHandle(MainController.updateStatus));
router.post("/form", MainController.saveForm);
router.get("/form/:id?", asyncHandle(MainController.getForm));
router.get("/delete/:id", asyncHandle(MainController.deleteItem));
router.get("/", asyncHandle(MainController.getAll));

module.exports = router;
