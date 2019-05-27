const mongoose = require("mongoose");
const User = mongoose.model("User");


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
        try {
            if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                return res.render('login', {
                    messageboth: "Please check recapcha !",
                    username
                })
            }
            let user = await User.findOne({ username }).exec();
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
                res.render("login", {
                    messageboth: "Wait for admin to approve",
                    username
                });
            }
            {
                req.session.userAuth = {
                    username: username
                }
                res.redirect('/');
            }

        } catch (error) {
            console.log(error.message)
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
