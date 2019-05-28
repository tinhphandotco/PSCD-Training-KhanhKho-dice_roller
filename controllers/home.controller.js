const viewHome = (request, response) => {
    response.redirect('/login');
};
// const viewHome = (request, response) => {
//     if (request.session.userAuth) {
//         response.render("index", {
//             username: request.session.userAuth.username
//         });
//     } else {
//         response.redirect('/login');
//     }
//     response.end();
// };



module.exports = {
    viewHome
};



