const mongoose = require("mongoose");
const User = mongoose.model("User");
request = require('request');
const { Recapcha} = require("../utils");

const viewLogin = (request, response) => {
    response.render("login");
};


const login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({ username }).exec();
    if (username && password) {
        Recapcha.checkRecapcha(req)
            .then(() => {
                if (!user) {
                    return res.render("login", {
                        messageboth: "Username or Password Incorrect !",
                        username
                    });
                }
                if (!user.checkPassword(password)) {
                    return res.render("login", {
                        messageboth: "Username or Password Incorrect !",
                        username
                    });
                }
                let userActive = user.status;
                if (userActive != 'active') {
                    return res.render("login", {
                        messageboth: "Wait for admin to approve",
                        username
                    });
                }
                {
                    req.session.userAuth = {
                        username: username
                    }
                    const redirectTo = req.session.redirectTo || '/';
                    delete req.session.redirectTo;
                    res.redirect(redirectTo);
                }
            })
            .catch((body) => {
                    return res.render('login', {
                        messageboth: "Failed captcha verification !",
                        username
                    })
            })
    }
    else {
        res.render("login", {
            messageuser: username == '' ? "Username is not empty !" : '',
            messagepass: password == '' ? "Password is not empty !" : '',
            username
        })
    }

}

module.exports = {
    viewLogin,
    login
};
