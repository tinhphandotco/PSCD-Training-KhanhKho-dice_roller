const homeCtrl = require("./home.controller");
const loginCtrl = require("./login.controller");
const logoutCtrl = require("./logout.controller");
const registerCtrl = require("./register.controller");
const diceCtrl = require("./dice-roller.controller");
const vdCtrl = require("./vd.controller");

module.exports = {
    diceCtrl,
    homeCtrl,
    loginCtrl,
    logoutCtrl,
    registerCtrl,
    vdCtrl
}