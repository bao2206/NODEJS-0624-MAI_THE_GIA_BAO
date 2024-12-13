var express = require("express");
var router = express.Router();
const {menus, settings, user} = require("../../middleware/localMiddleware");
router.use(settings);
router.use(menus);
router.use(user);
// router.use(cart);
// router.use(product);
// router.use("/signin", require("./account_router"));



router.use("/account", require("./account_router"));
router.use("/cart", require("./cart_router"));
router.use("/", require("./homepage_router"));
module.exports = router;
