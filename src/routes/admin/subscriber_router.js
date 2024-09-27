const express = require('express');
const router = express.Router();
const MainController = require("../../controllers/subscriber_controllers");
const {asyncHandle} = require("../../utils/asyncHandle");
router.post("/sendEmail", asyncHandle(MainController.saveEmailAndSendIt));
router.post("/update-status/:id",asyncHandle(MainController.updateStatus));
router.get("/delete/:id", MainController.deleteItem);
router.get("/", asyncHandle(MainController.getAll));
module.exports = router;