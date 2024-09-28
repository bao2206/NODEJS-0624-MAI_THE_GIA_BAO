const express = require('express');
const router = express.Router();
const MainController = require("../../controllers/settings_controllers");
const {asyncHandle} = require("../../utils/asyncHandle");

    router.get('/', asyncHandle(MainController.getAll))
        
    router.post('/', asyncHandle(MainController.setting))

    router.get('/form/:id?', asyncHandle(MainController.getForm))

module.exports = router;