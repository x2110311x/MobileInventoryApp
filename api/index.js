var express = require('express');
const fs = require('fs');
var app = express();

const config = require('./config.json')


const api = require('./api');
require('./login')(app);

app.use("/api", api);

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