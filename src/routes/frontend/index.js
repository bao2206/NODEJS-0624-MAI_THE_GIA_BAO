var express = require("express");
var router = express.Router();
router.use("/", require("./homepage_router"));
module.exports = router;
