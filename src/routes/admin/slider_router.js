const express = require("express");
const router = express.Router();
const MainController = require("../../controllers/slider_controllers");
// const upload = require("../../middleware/upload");
router.post("/update-ordering/:id", MainController.updateOrdering);
router.post("/update-status/:id", MainController.updateStatus);
router.post("/form", MainController.saveForm);
router.get("/form/:id?", MainController.getForm);
router.get("/delete/:id", MainController.deleteItem);
router.get("/", MainController.getAll);

module.exports = router;
