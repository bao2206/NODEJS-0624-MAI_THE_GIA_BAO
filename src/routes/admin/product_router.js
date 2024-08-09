var express = require("express");
var router = express.Router();
const ProductControllers = require("../../controllers/product_controllers");
router.post("/update-status/:id", ProductControllers.updateStatus);
router.post("/form", ProductControllers.saveForm);
router.get("/form/:id?", ProductControllers.getForm);
router.get("/delete/:id", ProductControllers.deleteProduct);
router.get("/", ProductControllers.getAll);
module.exports = router;
