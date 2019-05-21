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

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(morgan(':date[web] :method :status :url'));
app.use('/', router);

// app.listen(3000);
app.listen(port, () => console.log(`app listening on port ${port}!`))


