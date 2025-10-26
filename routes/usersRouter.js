var express = require('express');
var router = express.Router();
const userController = require('../Controllers/userController');
/* GET users listing. */
router.post('/createClient', userController.createClient);
router.post('/createAdmin', userController.createAdmin);
router.get('/creategetAllUsers', userController.creategetAllUsers);


module.exports = router;
