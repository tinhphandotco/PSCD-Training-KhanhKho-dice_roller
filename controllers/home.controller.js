
const mongoose = require("mongoose");
const User = mongoose.model("User");

const viewHome = async (request, response) => {
    let username= request.session.userAuth.username;
    let user = await User.findOne({ username }).exec();
    let userCoin=user.coin;
    response.render('index',{
        username: username,
        userCoin:userCoin
    });
};

module.exports = {
    viewHome
};



