var express = require("express");
var router = express.Router();
const ItemController = require("./item_controllers");
router.post("/form", ItemController.saveForm);
router.get("/form", ItemController.getForm);
//cập nhật item
router.post("/edit/:id", ItemController.updateItem);
router.get("/edit/:id", ItemController.getFormUpdateItem);

//xóa item
router.get("/delete/:id", ItemController.deleteItem);
//tìm kiếm
router.get("/search", ItemController.searchItem);

router.get("/:status?", ItemController.getAll);
//chuyển db lên sever chia component

module.exports = router;
