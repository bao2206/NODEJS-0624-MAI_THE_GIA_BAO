var express = require("express");
var router = express.Router();
const HomepageController = require("../../controllers/homepage_controllers");

router.get("/", HomepageController.getHomepage);
module.exports = router;
