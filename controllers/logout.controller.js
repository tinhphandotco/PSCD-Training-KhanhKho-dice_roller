const logout = (request, response) => {
    // request.session.destroy();
    response.redirect('/login');
};

module.exports = {
    logout
};