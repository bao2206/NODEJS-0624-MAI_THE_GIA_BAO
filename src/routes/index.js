var express = require("express");
var router = express.Router();
const {user} = require("../middleware/localMiddleware");
router.use(user);

router.use("/admin", require("./admin"));
router.use("/", require("./frontend"));
module.exports = router;
