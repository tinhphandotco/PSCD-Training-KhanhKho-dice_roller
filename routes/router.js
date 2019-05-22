const express = require('express')
const router = express.Router()

const {
    homeCtrl,
    loginCtrl,
    logoutCtrl,
    registerCtrl
} 
= require("../controllers");


router.get('/login',loginCtrl.viewLogin);
router.post('/login',loginCtrl.login );

router.get('/',homeCtrl.viewHome);

router.get('/logout',logoutCtrl.logout);

router.get('/register',registerCtrl.viewRegister);
router.post('/register',registerCtrl.register);

module.exports = router


