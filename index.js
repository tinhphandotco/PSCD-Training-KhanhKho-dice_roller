require('dotenv').config()
require('./models')
const express = require("express");
const router = require('./routes/router');
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

// app.post('/', function(req, res) {
//     if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
//     {
//       return res.json({"responseError" : "Please select captcha first"});
//     }
//     const secretKey = "6LflP6UUAAAAAE5qFqHCAJVxJ4hsO-M-jXfTWzS_";

//     const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

//     request(verificationURL,function(error,response,body) {
//       body = JSON.parse(body);

//       if(body.success !== undefined && !body.success) {
//         return res.json({"responseError" : "Failed captcha verification"});
//       }
//       res.json({"responseSuccess" : "Sucess"});
//     });
//   });



app.listen(port, () => console.log(`app listening on port ${port}!`))
// site_key 6LedPqUUAAAAAHLd0CPmQBLAL9WIJX8m7tZeMotY
// secret key 6LflP6UUAAAAAE5qFqHCAJVxJ4hsO-M-jXfTWzS_




