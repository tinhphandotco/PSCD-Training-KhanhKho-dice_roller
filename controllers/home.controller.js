const viewHome = (request, response) => {
    response.render('index',{
        username: request.session.userAuth.username
    });
};

module.exports = {
    viewHome
};



