const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
request = require('request');

const viewRegister = (request, response) => {
    response.render("register");
};

const register = async (req, res) => {
    const {
        firstname,
        lastname,
        username,
        email,
        password,
        re_password,
    } = req.body;
    try {
        const result = User.joiValidate({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            re_password: re_password
        })
        if (result.error != null)
            return res.render("register", {
                messagefirst: result.error.details[0].path == 'firstname' ? result.error.details[0].message : '',
                messagelast: result.error.details[0].path == 'lastname' ? result.error.details[0].message : '',
                messageuser: result.error.details[0].path == 'username' ? result.error.details[0].message : '',
                messageemail: result.error.details[0].path == 'email' ? result.error.details[0].message : '',
                messagepass: result.error.details[0].path == 'password' ? result.error.details[0].message : '',
                message: result.error.details[0].path == 're_password' ? result.error.details[0].message : '',
                firstname, lastname, username, email
            });
        let user = await User.findOne({ $or: [{ username: username }, { email: email }] }).exec();
        if (user) {
            return res.render("register", {
                messageuser: user.username == username ? "Username already exist" : '',
                messageemail: user.email == email ? "Email already exist" : '',
                firstname, lastname, username, email

            });
        }
    }
    catch (error) {
        return res.render("register", {
            messageboth: "Register didn't success !"
        });
    }

    if (password != re_password) {
        res.render("register", {
            message: "Confirm password is incorrect",
            firstname, lastname, username, email
        });
    }
    else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
        });
        if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.render('register', {
                messageboth: "Please check recapcha !",
                firstname, lastname, username, email
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
        });
        try {
            await user.save();
        } catch (error) {
            return res.render("register", {
                messageboth: "Register didn't success !"
            });
        }

        return res.redirect("/login");
    }
};

module.exports = {
    viewRegister,
    register
};