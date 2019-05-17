const express = require("express");
const router = require('./routes/router');

const app = express();
const port= process.env.PORT || 3000;

app.use(express.static(__dirname + '/public')); 
app.set("view engine", "ejs");
app.set("views", "./views");
app.use('/', router);

// app.listen(3000);
app.listen(port, () => console.log(`app listening on port ${port}!`))


