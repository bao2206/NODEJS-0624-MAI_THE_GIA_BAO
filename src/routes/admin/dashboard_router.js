var express = require("express");
var router = express.Router();
const MainController = require("../../controllers/dashboard_controllers");

router.get("/", MainController.getAll);
module.exports = router;
