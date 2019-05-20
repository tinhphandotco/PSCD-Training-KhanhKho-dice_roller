require('dotenv').config()
const express = require("express");
const router = require('./routes/router');
const morgan = require("morgan")
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan(':date[web] :method :url'))
// app.use(morgan());
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use('/', router);

app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        if (username === 'user1' && password === "123") {
            request.session.loggedin = true;
            request.session.username = username;
            response.redirect('/');
        } else {
            if (username != 'user1' && password != '123')
                response.send('Incorrect Username and Password !');
            if (username != 'user1')
                response.send('Incorrect Username !');
            if (password != '123')
                response.send('Incorrect password !');
        }
        response.end();
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

// app.listen(3000);
app.listen(port, () => console.log(`app listening on port ${port}!`))


