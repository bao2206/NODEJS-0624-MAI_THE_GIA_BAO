var express = require('express');
var router = express.Router();
const MainController = require('../../controllers/cart_controllers');
const {asyncHandle} =  require("../../utils/asyncHandle");
    router.post('/update-discount', asyncHandle(MainController.updateDiscount))
    router.get('/', asyncHandle(MainController.getCart))
    
module.exports = router;