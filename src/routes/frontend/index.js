var express = require("express");
var router = express.Router();
const {menus} = require("../../middleware/localMiddleware");
router.use(menus)
router.use("/account", require("./account_router"));
router.use("/cart", require("./cart_router"));
router.use("/", require("./homepage_router"));
module.exports = router;
