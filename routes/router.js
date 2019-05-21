const express = require('express')
const router = express.Router()

const {
    homeCtrl,
    loginCtrl,
    logoutCtrl
} 
= require("../controllers");


router.get('/login',loginCtrl.viewLogin);
router.post('/login',loginCtrl.login );

router.get('/',homeCtrl.viewHome);

router.get('/logout',logoutCtrl.logout);

module.exports = router


// router.get("/login", function (request, response) {
//     response.render("login");
// });
// router.post('/login', function (request, response) {
//     let username = request.body.username;
//     let password = request.body.password;
//     if (username && password) {
//         if (username === 'user1' && password === "123") {

//             request.session.userAuth = {
//                 username: username
//             }
//             response.redirect('/');
//         }
//         else {
//             if (username != 'user1' || password != '123') {
//                 if (username == 'user1') tmpuser = username
//                 else tmpuser = '';
//                 response.render("login", {
//                     messageboth: "Username or Password Incorrect !",
//                     tmpuser
//                 });
//             }
//         }
//     }
//     else {
//         if (username == '' && password == '')
//             response.render("login", {
//                 messageuser: "Username is not empty !",
//                 messagepass: "Password is not empty !"
//             })
//         if (username == '') {
//             if (password) tmppass = password;
//             response.render("login", {
//                 messageuser: "Username is not empty !",
//                 tmppass
//             });
//         }

//         if (password == '') {
//             if (username) tmpuser = username;
//             response.render("login", {
//                 messagepass: "Password is not empty !",
//                 tmpuser
//             });
//         }

//     }
// });
// router.get('/', function (request, response) {
//     if (request.session.userAuth) {
//         response.render("index", {
//             username: request.session.userAuth.username
//         });
//     } else {
//         // response.render("login");
//         response.redirect('/login');
//     }
//     response.end();
// });

// router.get('/logout', function (request, response) {
//     request.session.destroy();
//     response.redirect('/login');
//     // response.render("login");
// });


