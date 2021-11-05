var express = require('express');
var http = require('http');
var https = require('https');
var passport = require('passport');
var BearerStrategy = require("passport-azure-ad").BearerStrategy;
const fs = require('fs');


var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var app = express();

const config = require('./config.json')
  
var bearerStrategy = new BearerStrategy(config.passport, 
    function(token, done) {
        return done(null, {}, token);
    }
);

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: config.sessionsecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
passport.use(bearerStrategy);

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


var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(config.SERVER_PORT);
httpsServer.listen(config.SERVER_PORT_HTTPS);