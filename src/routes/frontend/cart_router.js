var express = require('express');
var router = express.Router();
const MainController = require('../../controllers/cart_controllers');
const {asyncHandle} =  require("../../utils/asyncHandle");
    //router.post('checkout-cart/:cartId',MainController.checkoutCart);
    router.post('/update-cart/:productId', asyncHandle(MainController.updateProductCart));
    router.post('/update-discount', asyncHandle(MainController.updateDiscount))
    router.get('/delete/:productId', asyncHandle(MainController.deleteProductCart));
    router.post('/add/:productId', asyncHandle(MainController.addCart));
    router.get('/', asyncHandle(MainController.getCart))
    
module.exports = router;