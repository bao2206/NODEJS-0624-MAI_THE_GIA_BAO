var express = require('express');
var router = express.Router();
const MainController = require('../../controllers/account_controllers');
const {asyncHandle} =  require("../../utils/asyncHandle");

// console.log('acount')
router.post('/signup', MainController.SignUp);
// console.log('sigin')
router.post('/logout', MainController.Logout);
router.post('/signin', MainController.SignIn);
    
module.exports = router;