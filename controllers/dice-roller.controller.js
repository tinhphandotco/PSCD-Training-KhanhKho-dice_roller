const viewDiceRoller = (request, response) => {
    if (request.session.userAuth) {
        response.render('dice-roller', {
            username: request.session.userAuth.username
        });
    } else {
        request.session.redirectTo = '/dice-roller';
        response.redirect('/login');
    }
    response.end();

};

module.exports = {
    viewDiceRoller
};