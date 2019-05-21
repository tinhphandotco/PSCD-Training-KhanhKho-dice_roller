const express = require('express')
const router = express.Router()

router.get("/login", function (request, response) {
    response.render("login");
});
router.post('/login', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        if (username === 'user1' && password === "123") {

            request.session.userAuth= {
                username:username,
                password:password,
            }
            request.session.loggedin = true;
            response.redirect('/');
        } 
        else {
            if (username != 'user1' && password != '123') {
                response.render("login", {
                    messageuser: "Incorrect Username !",
                    messagepass: "Incorrect Password !"
                });
            }
            if (username == '')
                response.render("login", {
                    messageuser: "Username is not empty !"
                })
            else {
                if (username != 'user1') {
                    if (password == '123') tmppass = password;
                    response.render("login", {
                        messageuser: "Incorrect Username !",
                        tmppass
                    });
                }

            }

            if (password == '')
                response.render("login", {
                    messagepass: "Password is not empty !"
                })
            else {
                if (password != '123') {
                    if (username == 'user1') tmpuser = username;
                    response.render("login", {
                        messagepass: "Incorrect Password !",
                        tmpuser
                    });
                }

            }
        }
    }
    // else {
    //     response.send('Please enter Username and Password!');
    //     response.end();
    // }
});
router.get('/', function (request, response) {
    if (request.session.loggedin) {
        response.render("index", {
            username: request.session.userAuth.username
        });
    } else {
        response.render("login");
    }
    response.end();
});

router.get('/logout', function (request, response) {
    request.session.destroy();
    response.render("login");
});

module.exports = router
