const viewLogin = (request, response) => {
    response.render("login");
};

const login = (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        if (username === 'user1' && password === "123") {

            request.session.userAuth = {
                username: username
            }
            response.redirect('/');
        }
        else {
            if (username != 'user1' || password != '123') {
                if (username == 'user1') tmpuser = username
                else tmpuser = '';
                response.render("login", {
                    messageboth: "Username or Password Incorrect !",
                    tmpuser
                });
            }
        }
    }
    else {
        if (username == '' && password == '')
            response.render("login", {
                messageuser: "Username is not empty !",
                messagepass: "Password is not empty !"
            })
        if (username == '') {
            if (password) tmppass = password;
            response.render("login", {
                messageuser: "Username is not empty !",
                tmppass
            });
        }

        if (password == '') {
            if (username) tmpuser = username;
            response.render("login", {
                messagepass: "Password is not empty !",
                tmpuser
            });
        }

    }
};

module.exports = {
    viewLogin,
    login
};
