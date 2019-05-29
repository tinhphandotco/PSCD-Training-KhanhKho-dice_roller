const viewDiceRoller = (request, response) => {
    response.render('dice-roller', {
        username: request.session.userAuth.username
    });
};

module.exports = {
    viewDiceRoller
};