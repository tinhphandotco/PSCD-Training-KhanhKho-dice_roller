const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
request = require('request');

const viewRegister = (request, response) => {
    response.render("register");
};

const checkRecapcha = (req) => {
    return new Promise((resolve, reject) => {
        const secretKey = "6LflP6UUAAAAAE5qFqHCAJVxJ4hsO-M-jXfTWzS_";
        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        request(verificationURL, function (error, response, body) {
            body = JSON.parse(body);
            if (error || body.success == false)
                reject(body);
            else
                resolve(body);
        });
    });
}

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
        if (result.error != null) {
            const arrayError = result.error.details[0];
            return res.render("register", {
                messagefirst: arrayError.path == 'firstname' ? arrayError.message : '',
                messagelast: arrayError.path == 'lastname' ? arrayError.message : '',
                messageuser: arrayError.path == 'username' ? arrayError.message : '',
                messageemail: arrayError.path == 'email' ? arrayError.message : '',
                messagepass: arrayError.path == 'password' ? arrayError.message : '',
                message: arrayError.path == 're_password' ? arrayError.message : '',
                firstname, lastname, username, email
            });
        }

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
        checkRecapcha(req)
            .then(() => {
                const hashedPassword = bcrypt.hashSync(password, 10);
                const user = new User({
                    firstname,
                    lastname,
                    username,
                    email,
                    password: hashedPassword,
                });
                try {
                    user.save();
                } catch (error) {
                    return res.render("register", {
                        messageboth: "Register didn't success !"
                    });
                }
                return res.redirect("/login");
            })
            .catch((body) => {
                if (body.success !== undefined && !body.success) {
                    return res.render('register', {
                        messageboth: "Failed captcha verification !",
                        firstname, lastname, username, email
                    })
                }
            })
    }
};

module.exports = {
    viewRegister,
    register
};