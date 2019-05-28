const isLogin = (req, res, next) => {
    if (req.session.userAuth) {
        return res.render("index", {
            username: req.session.userAuth.username
        });
    }
    return next();
};
const logout = (req, res, next) => {
    req.session.destroy();
    return next();
};

module.exports = {
    isLogin,
    logout
};