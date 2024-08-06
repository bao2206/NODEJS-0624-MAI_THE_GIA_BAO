const express = require("express");
const router = express.Router();
const ItemController = require("./item_controllers");
// const upload = require("../../middleware/upload");
router.post("/update-status/:id", ItemController.updateStatus);
router.post("/form", ItemController.saveForm);
router.get("/form/:id?", ItemController.getForm);
router.get("/delete/:id", ItemController.deleteItem);
router.get("/", ItemController.getAll);

module.exports = router;
