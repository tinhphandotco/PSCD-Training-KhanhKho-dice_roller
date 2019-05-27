const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");

const viewRegister = (request, response) => {
    response.render("register");
};

const register = async (request, response) => {
    const {
        firstname,
        lastname,
        username,
        email,
        password,
        re_password,
    } = request.body;
    try {
        const testemail = { email: request.body.email };
        var user = new User(testemail);
        var err = user.joiValidate(testemail);
        if (err) {
            console.log('ERROR')
        }
    } catch (error) {
        console.log(error.message)

    }
    if (firstname && lastname && username && email && password && re_password) {
        try {
            let user = await User.findOne({ $or: [{ username: username }, { email: email }] }).exec();
            if (user) {
                return response.render("register", {
                    messageuser: user.username == username ? "Username already exist" : '',
                    messageemail: user.email == email ? "Email already exist" : '',
                    firstname, lastname, username, email

                });
            }
        } catch (error) {
            console.log(error.message)
        }
        if (password != re_password) {
            response.render("register", {
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
            if (request.body['g-recaptcha-response'] === undefined || request.body['g-recaptcha-response'] === '' || request.body['g-recaptcha-response'] === null) {

                return response.render('register', {
                    messageboth: "Please check recapcha !",
                    firstname, lastname, username, email
                })
            }
            await user.save();
            return response.redirect("/login");
        }

    }
    else {
        response.render("register", {
            messagefirst: firstname == '' ? "Firstname is not empty !" : '',
            messagelast: lastname == '' ? "Lastname is not empty !" : '',
            messageuser: username == '' ? "Username is not empty !" : '',
            messageemail: email == '' ? "Email is not empty !" : '',
            messagepass: password == '' ? "Password is not empty !" : '',
            message: re_password == '' ? "Re_password is not empty !" : '',
            firstname, lastname, username, email
        })
    }

};

module.exports = {
    viewRegister,
    register
};