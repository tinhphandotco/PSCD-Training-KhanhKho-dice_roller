const express = require('express')
const router = express.Router()

const {
    homeCtrl,
    loginCtrl,
    logoutCtrl,
    registerCtrl,
    diceCtrl,
    vdCtrl
}
    = require("../../controllers");

const { auth } = require("../middleware")

router.get('/login', auth.doNotRequriedAuth, loginCtrl.viewLogin);
router.post('/login', auth.doNotRequriedAuth, loginCtrl.login);

router.get('/', auth.requireAuth, homeCtrl.viewHome);

router.get('/dice-roller', auth.requireAuth, diceCtrl.viewDiceRoller);
router.get('/vd', auth.requireAuth, vdCtrl.viewVd);

router.get('/register', auth.doNotRequriedAuth, registerCtrl.viewRegister);
router.post('/register', auth.doNotRequriedAuth, registerCtrl.register);

router.get('/logout', logoutCtrl.logout);

module.exports = router


