var express = require("express");
var router = express.Router();
const DashboardController = require("../../controllers/dashboard_controllers");

router.get("/", DashboardController.getAll);
module.exports = router;
