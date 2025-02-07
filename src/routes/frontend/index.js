var express = require("express");
var router = express.Router();
const {menus, settings} = require("../../middleware/localMiddleware");
router.use(menus);
router.use(settings);
router.use("/account", require("./account_router"));
router.use("/cart", require("./cart_router"));
router.use("/", require("./homepage_router"));
module.exports = router;
