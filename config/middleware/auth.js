const requireAuth = (req, res, next) => {
    if (req.session.userAuth) {
        return next();
    }
    else {
        req.session.redirectTo = req.path;
        res.redirect('/login');
    }
};

const doNotRequriedAuth = (req, res, next) => {
    if (req.session.userAuth) {
        res.redirect('/');
    }
    else {
        next();
    }
};


module.exports = {
    requireAuth,
    doNotRequriedAuth
};