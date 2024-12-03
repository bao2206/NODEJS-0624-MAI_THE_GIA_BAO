const express = require("express");
const router = express.Router();
const MainController = require("../../controllers/user_controllers");

router.get("/", MainController.getAll);

module.exports = router;