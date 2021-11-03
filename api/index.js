var express = require('express');
var passport = require('passport');
var BearerStrategy = require("passport-azure-ad").BearerStrategy;
const fs = require('fs');
var app = express();

const config = require('./config.json')
  
var bearerStrategy = new BearerStrategy(config.passport, 
    function(token, done) {
        return done(null, {}, token);
    }
);

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: config.sessionsecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

// Enable CORS for * because this is a demo project
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const api = require('./api');
const login = require('./auth');
app.use("/api", api);
app.use("/auth", login);

// Handle unknown requests
app.all('*', function (req, res) {
    res.status(404).send("404 - Unknown request");
});

// start Express app
var server = app.listen(config.SERVER_PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("API listening at http://%s:%s", host, port)
 })