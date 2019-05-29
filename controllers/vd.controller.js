const viewVd = (request, response) => {
    response.render('vd', {
        username: request.session.userAuth.username
    });
}

module.exports = {
    viewVd
};