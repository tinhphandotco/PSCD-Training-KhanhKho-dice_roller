const mongoose = require("mongoose");
const User = mongoose.model("User");
request = require('request');

const viewLogin = (request, response) => {
        response.render("login");
};

const login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({ username }).exec();
    if (username && password) {
        try {
            if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                return res.render('login', {
                    messageboth: "Please check recapcha !",
                    username
                })
            }
            const secretKey = "6LflP6UUAAAAAE5qFqHCAJVxJ4hsO-M-jXfTWzS_";
            const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
            request(verificationURL, function (error, response, body) {
                body = JSON.parse(body);
                if (body.success !== undefined && !body.success) {
                    return res.render('login', {
                        messageboth: "Failed captcha verification !",
                        username
                    })
                }
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
            });

        } catch (error) {
            return res.render("login", {
                messageboth: "Login didn't success"
            })
        }
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
