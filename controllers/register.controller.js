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
    if (firstname && lastname && username && email && password && re_password) {
        let user = await User.findOne({ username }).exec();
        if (user) {
            response.render("register", {
                messageuser: "Username already exist"
            });
        }
        let e_mail = await User.findOne({ email }).exec();
        if (e_mail) {
            response.render("register", {
                messageemail: "Email already exist"
            });
        }

        if (password != re_password) {
            response.render("register", {
                message: "Confirm password is incorrect"
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
        })
    }

};

module.exports = {
    viewRegister,
    register
};