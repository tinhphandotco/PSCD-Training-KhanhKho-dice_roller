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
        status
    } = request.body;

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
            status
        });

        await user.save();
        return response.redirect("/login");
    }
};

module.exports = {
    viewRegister,
    register
};