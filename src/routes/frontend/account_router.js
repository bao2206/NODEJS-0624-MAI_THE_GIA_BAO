var express = require('express');
var router = express.Router();
const MainController = require('../../controllers/account_controllers');
const {asyncHandle} =  require("../../utils/asyncHandle");
   router.post('/signup', MainController.SignUp());
   router.post('/signin', MainController.SignIn());
    
module.exports = router;