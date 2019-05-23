const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const User = require('../models/users')


const viewLogin = (request, response) => {
    if (request.session.userAuth)
        response.redirect('/')
    else
        response.render("login");
};

const login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        let user = await User.findOne({ username }).exec();
        let userActive = user.status;

        if (!user) {
            res.render("login", {
                messageboth: "Username or Password Incorrect !",
            });
        }

        if (!user.checkPassword(password)) {
            res.render("login", {
                messageboth: "Username or Password Incorrect !",
            });
        }
        if (userActive != 'active') {
            res.render("login", {
                messageboth: "Wait for admin to approve",
            });
        }
        {
            req.session.userAuth = {
                username: username
            }
            res.redirect('/');
        }

    }
    else {
        res.render("login", {
            messageuser: username == '' ? "Username is not empty !" : '',
            messagepass: password == '' ? "Password is not empty !" : ''
        })
    }

}

// const login = (request, response) => {
//     try {
//         let username = request.body.username;
//         let password = request.body.password;
//         if (username && password) {
//             if (username === 'user1' && password === "123") {

//                 request.session.userAuth = {
//                     username: username
//                 }
//                 response.redirect('/');
//             }
//             else {
//                 if (username != 'user1' || password != '123') {
//                     if (username == 'user1') tmpuser = username
//                     else tmpuser = '';
//                     response.render("login", {
//                         messageboth: "Username or Password Incorrect !",
//                         tmpuser
//                     });
//                 }
//             }
//         }
//         else {
//             response.render("login", {
//                 messageuser: username == '' ? "Username is not empty !" : '',
//                 messagepass: password == '' ? "Password is not empty !" : ''
//             })
//         }
//     } catch (error) {
//         return response.redirect("/login");

//     }

// };

module.exports = {
    viewLogin,
    login
};
