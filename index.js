require('dotenv').config()
require('./models')
const express = require("express");
const router = require('./config/routes/router');
const morgan = require("morgan")
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connection;
const MONGOOSE_DB_URL = process.env.MONGOOSE_DB_URL;
const app = express();
const port = process.env.PORT || 3000;



mongoose.connect(MONGOOSE_DB_URL, { useNewUrlParser: true });
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection database succeeded");
})


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


app.listen(port, () => console.log(`app listening on port ${port}!`))
// site_key 6LedPqUUAAAAAHLd0CPmQBLAL9WIJX8m7tZeMotY
// secret key 6LflP6UUAAAAAE5qFqHCAJVxJ4hsO-M-jXfTWzS_




