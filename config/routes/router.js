const express = require('express')
const router = express.Router()

const {
    homeCtrl,
    loginCtrl,
    logoutCtrl,
    registerCtrl,
    diceCtrl
}
    = require("../../controllers");

const { auth } = require("../middleware")

router.get('/login', loginCtrl.viewLogin);
router.post('/login', loginCtrl.login);

router.get('/', auth.isLogin, homeCtrl.viewHome);

router.get('/dice-roller', diceCtrl.viewDiceRoller);

router.get('/logout', auth.logout, logoutCtrl.logout);

router.get('/register', registerCtrl.viewRegister);
router.post('/register', registerCtrl.register);

module.exports = router


