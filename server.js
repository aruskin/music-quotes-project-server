const CONSTANTS = require('./consts');
const express = require('express')
const app = express();

// Configures CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin',
        CONSTANTS.CLIENT_URL);
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const session = require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

const mongoose = require('mongoose');
mongoose.connect(
     CONSTANTS.MONGODB_URL
    ,{useNewUrlParser: true, useUnifiedTopology: true});

require('./controllers/users-controller')(app);
require('./controllers/quotes-controller')(app);
require('./controllers/artists-controller')(app);

app.listen(process.env.PORT || 4000);