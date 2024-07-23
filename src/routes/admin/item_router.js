var express = require("express");
var router = express.Router();
const ItemController = require("../../controllers/item_controllers");
router.post("/form", ItemController.saveForm);
router.get("/form", ItemController.getForm);
//cập nhật item
router.post("/edit/:id", ItemController.updateItem);
router.get("/edit/:id", ItemController.getFormUpdateItem);

//xóa item
router.get("/delete/:id", ItemController.deleteItem);

router.get("/", ItemController.getAll);

module.exports = router;
