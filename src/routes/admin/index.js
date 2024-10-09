var express = require("express");
var router = express.Router();
router.use("/discount",require("./discount_router"))
router.use("/settings", require("./settings_router"));
router.use("/subscribe", require("./subscriber_router"));
router.use("/slider", require("./slider_router"));
router.use("/menu", require("./menu_router"));
router.use("/category", require("./category_router"));
router.use("/product", require("./product_router"));
router.use("/item", require("./item_router"));
router.use("/", require("./dashboard_router"));
module.exports = router;
